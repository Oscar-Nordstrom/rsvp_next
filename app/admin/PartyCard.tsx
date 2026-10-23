"use client";

import { useState } from "react";
import SubmitButton from "@/app/_components/SubmitButton";
import ConfirmButton from "@/app/_components/ConfirmButton";
import CopyButton from "@/app/_components/CopyButton";
import type { Party } from "@/lib/types";

interface PartyCardProps {
  party: Party;
  updateGuestName: (formData: FormData) => void;
  addGuestToParty: (formData: FormData) => void;
  deleteGuest: (formData: FormData) => void;
  deleteParty: (formData: FormData) => void;
}

function attendanceBadge(attending: boolean | null) {
  if (attending === null) return "No response yet";
  return attending ? "Attending ✅" : "Not attending ❌";
}

export default function PartyCard({
  party,
  updateGuestName,
  addGuestToParty,
  deleteGuest,
  deleteParty,
}: PartyCardProps) {
  const [addingGuest, setAddingGuest] = useState(false);

  return (
    <li className="flex flex-col gap-3 py-4">
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-border bg-surface-hover px-2.5 py-1 font-mono text-base font-semibold tracking-widest text-foreground">
          {party.token}
        </span>
        <CopyButton value={party.token} />
        <form action={deleteParty} className="ml-auto">
          <input type="hidden" name="id" value={party.id} />
          <ConfirmButton
            variant="danger"
            size="sm"
            confirmTitle="Remove party?"
            confirmMessage="This will remove every guest in this party and their RSVP link. This can't be undone."
            confirmLabel="Remove"
          >
            Remove party
          </ConfirmButton>
        </form>
      </div>

      {party.note && (
        <p className="text-xs text-subtle">Message: &quot;{party.note}&quot;</p>
      )}

      {party.transport !== null && (
        <p className="text-xs text-subtle">
          Transport: {party.transport ? "Yes ✅" : "No ❌"}
        </p>
      )}

      <ul className="flex flex-col gap-2">
        {party.guests.map((guest) => (
          <li
            key={guest.id}
            className="flex flex-col gap-1 rounded-lg border border-border p-3"
          >
            <div className="flex items-center gap-2">
              <form action={updateGuestName} className="flex flex-1 gap-2">
                <input type="hidden" name="id" value={guest.id} />
                <input
                  type="text"
                  name="name"
                  defaultValue={guest.name}
                  className="flex-1 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm"
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
                  confirmMessage={`This will remove ${guest.name} from this party.`}
                  confirmLabel="Remove"
                >
                  Remove
                </ConfirmButton>
              </form>
            </div>
            <div className="text-xs text-subtle">
              {attendanceBadge(guest.attending)}
              {guest.allergy_tags.length > 0 &&
                ` · ${guest.allergy_tags.join(", ")}`}
              {guest.allergy_note ? ` ("${guest.allergy_note}")` : ""}
            </div>
          </li>
        ))}
      </ul>

      {addingGuest ? (
        <form
          action={async (formData) => {
            await addGuestToParty(formData);
            setAddingGuest(false);
          }}
          className="flex gap-2"
        >
          <input type="hidden" name="partyId" value={party.id} />
          <input
            type="text"
            name="name"
            placeholder="Guest name"
            required
            autoFocus
            className="flex-1 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm"
          />
          <SubmitButton variant="secondary" size="sm">
            Add
          </SubmitButton>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setAddingGuest(true)}
          className="self-start text-xs text-subtle underline underline-offset-2"
        >
          + Add guest to this party
        </button>
      )}
    </li>
  );
}
