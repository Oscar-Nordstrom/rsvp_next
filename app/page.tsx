import SubmitButton from "@/app/_components/SubmitButton";
import { findRsvp } from "./actions";
import { text } from "@/lib/wedding";
import FloralFrame, { FloralDivider } from "@/app/_components/FloralCorners";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <FloralFrame>
      <main className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div>
          <h1 className="font-display text-4xl font-semibold text-foreground">
            {text.home.title}
          </h1>
          <div className="mt-3">
            <FloralDivider />
          </div>
          <p className="mt-3 max-w-sm text-muted">
            {text.home.intro}
          </p>
        </div>

        <form action={findRsvp} className="flex w-full max-w-xs flex-col gap-3">
          <input
            type="text"
            name="token"
            placeholder={text.home.codePlaceholder}
            required
            className="rounded-md border border-border bg-transparent px-3 py-2 text-center text-sm"
          />
          <SubmitButton>{text.home.submit}</SubmitButton>
          {error && (
            <p className="text-sm text-danger">
              {text.home.notFound}
            </p>
          )}
        </form>
      </main>
    </FloralFrame>
  );
}
