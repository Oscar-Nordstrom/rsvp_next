import SubmitButton from "@/app/_components/SubmitButton";
import { login } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold text-foreground">
        Admin login
      </h1>
      <form action={login} className="flex flex-col gap-4">
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          autoFocus
          className="rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        />
        <SubmitButton>Log in</SubmitButton>
        {error && <p className="text-sm text-danger">Incorrect password.</p>}
      </form>
    </main>
  );
}
