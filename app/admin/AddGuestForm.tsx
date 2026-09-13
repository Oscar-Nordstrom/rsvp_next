"use client";

import { useRef, useState } from "react";
import SubmitButton from "@/app/_components/SubmitButton";
import ConfirmDialog from "@/app/_components/ConfirmDialog";
import Select from "@/app/_components/Select";
import { MAX_PARTY_SIZE } from "@/lib/guests/party";

const partySizeOptions = Array.from(
  { length: MAX_PARTY_SIZE },
  (_, index) => index + 1,
);

interface AddGuestFormProps {
  action: (formData: FormData) => void;
  existingNames: string[];
}

export default function AddGuestForm({
  action,
  existingNames,
}: AddGuestFormProps) {
  const [open, setOpen] = useState(false);
  const [pendingName, setPendingName] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const skipCheckRef = useRef(false);

  const normalizedExisting = existingNames.map((name) =>
    name.trim().toLowerCase(),
  );

  return (
    <>
      <form
        ref={formRef}
        action={action}
        className="flex gap-3"
        onSubmit={(e) => {
          if (skipCheckRef.current) {
            skipCheckRef.current = false;
            return;
          }

          const name = new FormData(e.currentTarget).get("name");
          const trimmed = typeof name === "string" ? name.trim() : "";
          if (trimmed && normalizedExisting.includes(trimmed.toLowerCase())) {
            e.preventDefault();
            setPendingName(trimmed);
            setOpen(true);
          }
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Guest name"
          required
          className="flex-1 rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        />
        <Select
          name="partySize"
          options={partySizeOptions}
          defaultValue={1}
          aria-label="Party size"
          title="Number of people this invite covers"
          className="w-16"
        />
        <SubmitButton>Add guest</SubmitButton>
      </form>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Guest already exists"
        message={`A guest named "${pendingName}" has already been added. Add another one with the same name?`}
        confirmLabel="Add anyway"
        confirmVariant="primary"
        onConfirm={() => {
          skipCheckRef.current = true;
          formRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
