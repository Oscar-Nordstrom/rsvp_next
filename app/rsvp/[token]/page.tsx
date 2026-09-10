import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { weddingDetails } from "@/lib/wedding";
import Button from "@/app/_components/Button";
import { submitRsvp } from "./actions";

export default async function RsvpPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createSupabaseServerClient();

  const { data: guest } = await supabase
    .from("guests")
    .select("name, attending, note")
    .eq("token", token)
    .single();

  if (!guest) {
    notFound();
  }

  const hasResponded = guest.attending !== null;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Hi {guest.name}!
        </h1>
        <p className="mt-1 text-muted">
          Will you be joining us?
        </p>
      </div>

      <div className="flex aspect-4/3 w-full items-center justify-center rounded-2xl border border-dashed border-border bg-surface-hover text-xs text-subtle">
        Photo coming soon
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="font-medium text-foreground">When</dt>
        <dd className="text-muted">
          {weddingDetails.date} · {weddingDetails.time}
        </dd>

        <dt className="font-medium text-foreground">Where</dt>
        <dd className="text-muted">
          {weddingDetails.venue}, {weddingDetails.address}
        </dd>

        <dt className="font-medium text-foreground">Theme</dt>
        <dd className="text-muted">{weddingDetails.theme}</dd>
      </dl>

      <form action={submitRsvp} className="flex flex-col gap-5">
        <input type="hidden" name="token" value={token} />

        <div className="flex gap-3">
          <Button type="submit" name="attending" value="true" className="flex-1">
            Yes, I&apos;ll be there
          </Button>
          <Button
            type="submit"
            name="attending"
            value="false"
            variant="secondary"
            className="flex-1"
          >
            Can&apos;t make it
          </Button>
        </div>

        <label className="flex flex-col gap-1 text-sm text-muted">
          Note for the hosts (optional)
          <textarea
            name="note"
            defaultValue={guest.note ?? ""}
            rows={3}
            className="rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </label>
      </form>

      {hasResponded && (
        <p className="text-sm text-subtle">
          Current answer:{" "}
          {guest.attending ? "attending ✅" : "not attending"}. You can
          change it anytime before the event.
        </p>
      )}
    </main>
  );
}
