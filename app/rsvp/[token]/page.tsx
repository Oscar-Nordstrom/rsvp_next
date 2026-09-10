import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Hi {guest.name}!
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Will you be joining us?
        </p>
      </div>

      <form action={submitRsvp} className="flex flex-col gap-5">
        <input type="hidden" name="token" value={token} />

        <div className="flex gap-3">
          <button
            type="submit"
            name="attending"
            value="true"
            className="flex-1 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Yes, I&apos;ll be there
          </button>
          <button
            type="submit"
            name="attending"
            value="false"
            className="flex-1 rounded-full border border-solid border-black/[.08] px-5 py-3 text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
          >
            Can&apos;t make it
          </button>
        </div>

        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          Note for the hosts (optional)
          <textarea
            name="note"
            defaultValue={guest.note ?? ""}
            rows={3}
            className="rounded-md border border-black/[.08] bg-transparent px-3 py-2 text-sm dark:border-white/[.145]"
          />
        </label>
      </form>

      {hasResponded && (
        <p className="text-sm text-zinc-500">
          Current answer:{" "}
          {guest.attending ? "attending ✅" : "not attending"}. You can
          change it anytime before the event.
        </p>
      )}
    </main>
  );
}
