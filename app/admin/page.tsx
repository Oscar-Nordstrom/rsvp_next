import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addGuest, deleteGuest, logout, updateGuest } from "./actions";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const supabase = createSupabaseServerClient();
  const { data: guests } = await supabase
    .from("guests")
    .select("id, token, name, attending, note")
    .order("created_at", { ascending: true });

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">
          Guests
        </h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-subtle underline underline-offset-2"
          >
            Log out
          </button>
        </form>
      </div>

      <form action={addGuest} className="flex gap-3">
        <input
          type="text"
          name="name"
          placeholder="Guest name"
          required
          className="flex-1 rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-primary-hover"
        >
          Add guest
        </button>
      </form>

      <ul className="flex flex-col divide-y divide-border">
        {guests?.map((guest) => (
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
                <button
                  type="submit"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-medium"
                >
                  Save
                </button>
              </form>
              <form action={deleteGuest}>
                <input type="hidden" name="id" value={guest.id} />
                <button
                  type="submit"
                  className="rounded-full border border-danger-border px-3 py-1.5 text-xs font-medium text-danger"
                >
                  Remove
                </button>
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
            <div className="truncate text-xs">
              /rsvp/{guest.token}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
