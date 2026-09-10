import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import Button from "@/app/_components/Button";
import ConfirmButton from "@/app/_components/ConfirmButton";
import CopyButton from "@/app/_components/CopyButton";
import AddGuestForm from "./AddGuestForm";
import { addGuest, deleteGuest, logout, updateGuest } from "./actions";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol =
    headersList.get("x-forwarded-proto") ??
    (process.env.NODE_ENV === "development" ? "http" : "https");
  const origin = `${protocol}://${host}`;

  const supabase = createSupabaseServerClient();
  const { data: guests } = await supabase
    .from("guests")
    .select("id, token, name, attending, note")
    .order("created_at", { ascending: true });

  const guestList = guests ?? [];
  const respondedCount = guestList.filter((g) => g.attending !== null).length;
  const attendingCount = guestList.filter((g) => g.attending === true).length;
  const notAttendingCount = guestList.filter(
    (g) => g.attending === false,
  ).length;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Guests
        </h1>
        <form action={logout}>
          <Button type="submit" variant="ghost">
            Log out
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border p-4">
          <div className="text-2xl font-semibold text-foreground">
            {guestList.length}
          </div>
          <div className="text-xs text-subtle">Guests</div>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="text-2xl font-semibold text-foreground">
            {respondedCount}
          </div>
          <div className="text-xs text-subtle">Responded</div>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="text-2xl font-semibold text-foreground">
            {attendingCount}
          </div>
          <div className="text-xs text-subtle">Attending</div>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="text-2xl font-semibold text-foreground">
            {notAttendingCount}
          </div>
          <div className="text-xs text-subtle">Not attending</div>
        </div>
      </div>

      <AddGuestForm
        action={addGuest}
        existingNames={guestList.map((guest) => guest.name)}
      />

      <ul className="flex flex-col divide-y divide-border">
        {guestList.map((guest) => (
          <li key={guest.id} className="flex flex-col gap-2 py-4">
            <div className="flex items-center gap-2">
              <form action={updateGuest} className="flex flex-1 gap-2">
                <input type="hidden" name="id" value={guest.id} />
                <input
                  type="text"
                  name="name"
                  defaultValue={guest.name}
                  className="flex-1 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm"
                />
                <Button type="submit" variant="secondary" size="sm">
                  Save
                </Button>
              </form>
              <form action={deleteGuest}>
                <input type="hidden" name="id" value={guest.id} />
                <ConfirmButton
                  variant="danger"
                  size="sm"
                  confirmTitle="Remove guest?"
                  confirmMessage={`This will remove ${guest.name} and their RSVP link. This can't be undone.`}
                  confirmLabel="Remove"
                >
                  Remove
                </ConfirmButton>
              </form>
            </div>
            <div className="text-xs text-subtle">
              {guest.attending === null
                ? "No response yet"
                : guest.attending
                  ? "Attending ✅"
                  : "Not attending"}
              {guest.note ? ` — "${guest.note}"` : ""}
            </div>
            <div className="flex items-center gap-2">
              <div className="truncate text-xs text-subtle">
                {origin}/rsvp/{guest.token}
              </div>
              <CopyButton value={`${origin}/rsvp/${guest.token}`} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
