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
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Guests
        </h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-zinc-500 underline underline-offset-2"
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
          className="flex-1 rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm dark:border-white/[.145]"
        />
        <button
          type="submit"
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Add guest
        </button>
      </form>

      <ul className="flex flex-col divide-y divide-black/[.08] dark:divide-white/[.145]">
        {guests?.map((guest) => (
          <li key={guest.id} className="flex flex-col gap-2 py-4">
            <div className="flex items-center gap-2">
              <form action={updateGuest} className="flex flex-1 gap-2">
                <input type="hidden" name="id" value={guest.id} />
                <input
                  type="text"
                  name="name"
                  defaultValue={guest.name}
                  className="flex-1 rounded-md border border-black/[.08] bg-transparent px-3 py-1.5 text-sm dark:border-white/[.145]"
                />
                <button
                  type="submit"
                  className="rounded-full border border-black/[.08] px-3 py-1.5 text-xs font-medium dark:border-white/[.145]"
                >
                  Save
                </button>
              </form>
              <form action={deleteGuest}>
                <input type="hidden" name="id" value={guest.id} />
                <button
                  type="submit"
                  className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 dark:border-red-900"
                >
                  Remove
                </button>
              </form>
            </div>
            <div className="text-xs text-zinc-500">
              {guest.attending === null
                ? "No response yet"
                : guest.attending
                  ? "Attending ✅"
                  : "Not attending"}
              {guest.note ? ` — "${guest.note}"` : ""}
            </div>
            <div className="truncate text-xs text-zinc-400">
              /rsvp/{guest.token}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
