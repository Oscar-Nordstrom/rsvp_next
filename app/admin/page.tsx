import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import SubmitButton from "@/app/_components/SubmitButton";
import AddPartyForm from "./AddPartyForm";
import PartyCard from "./PartyCard";
import {
  addParty,
  addGuestToParty,
  deleteGuest,
  deleteParty,
  logout,
  updateGuestName,
} from "./actions";
import type { Party } from "@/lib/types";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("parties")
    .select(
      "id, token, note, transport, responded_at, guests(id, name, attending, allergy_tags, allergy_note)",
    )
    .order("created_at", { ascending: true });

  const parties = (data ?? []) as Party[];
  const allGuests = parties.flatMap((party) => party.guests);

  const totalGuests = allGuests.length;
  const respondedCount = parties.filter((p) => p.responded_at !== null).length;
  const attendingCount = allGuests.filter((g) => g.attending === true).length;
  const notAttendingCount = allGuests.filter(
    (g) => g.attending === false,
  ).length;

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Guests</h1>
        <form action={logout}>
          <SubmitButton variant="ghost">Log out</SubmitButton>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div className="rounded-xl border border-border p-4">
          <div className="text-2xl font-semibold text-foreground">
            {parties.length}
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
            {respondedCount}/{parties.length}
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

      <AddPartyForm
        action={addParty}
        existingNames={allGuests.map((guest) => guest.name)}
      />

      <ul className="flex flex-col divide-y divide-border">
        {parties.map((party) => (
          <PartyCard
            key={party.id}
            party={party}
            updateGuestName={updateGuestName}
            addGuestToParty={addGuestToParty}
            deleteGuest={deleteGuest}
            deleteParty={deleteParty}
          />
        ))}
      </ul>
    </main>
  );
}
