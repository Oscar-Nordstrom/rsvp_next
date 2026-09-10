export default function Home() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 bg-background px-6 text-center">
      <h1 className="text-2xl font-semibold text-foreground">
        You&apos;re invited!
      </h1>
      <p className="max-w-sm text-muted">
        Check your invite for your personal RSVP link.
      </p>
    </main>
  );
}
