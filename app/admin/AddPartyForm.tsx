"use client";

import { useId, useState } from "react";
import Button from "@/app/_components/Button";
import SubmitButton from "@/app/_components/SubmitButton";
import Dialog from "@/app/_components/Dialog";
import { MAX_PARTY_SIZE } from "@/lib/guests/party";

interface AddPartyFormProps {
  action: (formData: FormData) => void;
  existingNames: string[];
}

export default function AddPartyForm({
  action,
  existingNames,
}: AddPartyFormProps) {
  const [open, setOpen] = useState(false);
  const [names, setNames] = useState<string[]>([""]);
  const idPrefix = useId();

  const normalizedExisting = existingNames.map((name) =>
    name.trim().toLowerCase(),
  );

  function reset() {
    setNames([""]);
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Add party
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) reset();
        }}
        title="Add party"
        className="max-w-md"
      >
        <form
          action={async (formData) => {
            await action(formData);
            setOpen(false);
            reset();
          }}
          className="mt-4 flex flex-col gap-3"
        >
          <div className="flex flex-col gap-2">
            {names.map((name, index) => {
              const isDuplicate =
                name.trim() &&
                normalizedExisting.includes(name.trim().toLowerCase());

              return (
                <div key={`${idPrefix}-${index}`} className="flex flex-col gap-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="names"
                      placeholder="Guest name"
                      required
                      autoFocus={index === 0}
                      value={name}
                      onChange={(e) =>
                        setNames((current) =>
                          current.map((n, i) =>
                            i === index ? e.target.value : n,
                          ),
                        )
                      }
                      className="flex-1 rounded-md border border-border bg-transparent px-3 py-2 text-sm"
                    />
                    {names.length > 1 && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        aria-label="Remove guest"
                        onClick={() =>
                          setNames((current) =>
                            current.filter((_, i) => i !== index),
                          )
                        }
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                  {isDuplicate && (
                    <p className="text-xs text-subtle">
                      A guest named &quot;{name.trim()}&quot; already exists.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {names.length < MAX_PARTY_SIZE && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="self-start"
              onClick={() => setNames((current) => [...current, ""])}
            >
              + Add guest
            </Button>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <SubmitButton size="sm">Add party</SubmitButton>
          </div>
        </form>
      </Dialog>
    </>
  );
}
