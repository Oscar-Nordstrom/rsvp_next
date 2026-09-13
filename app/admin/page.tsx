import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import ConfirmButton from "@/app/_components/ConfirmButton";
import CopyButton from "@/app/_components/CopyButton";
import SubmitButton from "@/app/_components/SubmitButton";
import Select from "@/app/_components/Select";
import AddGuestForm from "./AddGuestForm";
import { addGuest, deleteGuest, logout, updateGuest } from "./actions";
import { MAX_PARTY_SIZE } from "@/lib/guests/party";

const partySizeOptions = Array.from(
  { length: MAX_PARTY_SIZE },
  (_, index) => index + 1,
);

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const supabase = createSupabaseServerClient();
  const { data: guests } = await supabase
    .from("guests")
    .select("id, token, name, attending, note, party_size, attending_count")
    .order("created_at", { ascending: true });

  const guestList = guests ?? [];
  const totalGuests = guestList.reduce((sum, g) => sum + g.party_size, 0);
  const respondedCount = guestList.filter((g) => g.attending !== null).length;
  const attendingCount = guestList
    .filter((g) => g.attending === true)
    .reduce((sum, g) => sum + g.attending_count, 0);
  const notAttendingCount = guestList.reduce((sum, g) => {
    if (g.attending === false) {
      return sum + g.party_size;
    }
    if (g.attending === true) {
      return sum + (g.party_size - g.attending_count);
    }
    return sum;
  }, 0);

  function attendanceStatus(guest: (typeof guestList)[number]) {
    if (guest.attending === null) {
      return "No response yet";
    }
    if (guest.attending === false) {
      return "Not attending ❌";
    }
    if (guest.attending_count >= guest.party_size) {
      return `Attending ✅ (${guest.attending_count}/${guest.party_size})`;
    }
    return `Some attending ⚠️ (${guest.attending_count}/${guest.party_size})`;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Guests
        </h1>
        <form action={logout}>
          <SubmitButton variant="ghost">Log out</SubmitButton>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-border p-4">
          <div className="text-2xl font-semibold text-foreground">
            {guestList.length}
          </div>
          <div className="text-xs text-subtle">Invites</div>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="text-2xl font-semibold text-foreground">
            {totalGuests}
          </div>
          <div className="text-xs text-subtle">Total guests</div>
        </div>
        <div className="rounded-xl border border-border p-4">
          <div className="text-2xl font-semibold text-foreground">
            {respondedCount}/{guestList.length}
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
                <Select
                  name="partySize"
                  options={partySizeOptions}
                  defaultValue={guest.party_size}
                  aria-label="Party size"
                  title="Number of people this invite covers"
                  compact
                  className="w-14"
                />
                <SubmitButton variant="secondary" size="sm">
                  Save
                </SubmitButton>
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
              {attendanceStatus(guest)}
              {guest.attending === null &&
                guest.party_size > 1 &&
                ` · Party of ${guest.party_size}`}
              {guest.note ? ` — "${guest.note}"` : ""}
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-border bg-surface-hover px-2.5 py-1 font-mono text-base font-semibold tracking-widest text-foreground">
                {guest.token}
              </span>
              <CopyButton value={guest.token} />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
