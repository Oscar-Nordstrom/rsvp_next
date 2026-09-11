import Button from "@/app/_components/Button";
import { findRsvp } from "./actions";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <div>
        <h1 className="font-display text-4xl font-semibold text-foreground">
          Oscar & Afrodite 2027
        </h1>
        <p className="mt-3 max-w-sm text-muted">
          Använd din personliga länk för att komma åt din inbjudan, eller
          ange din kod nedan.
        </p>
      </div>

      <form action={findRsvp} className="flex w-full max-w-xs flex-col gap-3">
        <input
          type="text"
          name="token"
          placeholder="Din kod"
          required
          className="rounded-md border border-border bg-transparent px-3 py-2 text-center text-sm"
        />
        <Button type="submit">Hitta min inbjudan</Button>
        {error && (
          <p className="text-sm text-danger">
            Vi kunde inte hitta någon inbjudan med den koden.
          </p>
        )}
      </form>
    </main>
  );
}
