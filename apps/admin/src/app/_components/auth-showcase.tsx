import { signIn } from "@tribal-cities/auth";
import { Button } from "@tribal-cities/ui/button";

export async function AuthShowcase() {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome to Myschivia
        </h1>
        <form>
          <Button
            size="lg"
            formAction={async () => {
              "use server";
              await signIn("discord");
            }}
          >
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}
