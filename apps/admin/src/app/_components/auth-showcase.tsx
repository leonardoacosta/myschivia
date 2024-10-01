import Link from "next/link";

import { signIn } from "@tribal-cities/auth";
import { Button } from "@tribal-cities/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tribal-cities/ui/dialog";

export async function AuthShowcase() {
  return (
    <div className="h-screen w-full lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Welcome to Tribal Cities</h1>
          </div>
          <div className="text-center">
            <form className="flex-row space-y-4">
              <Button
                size="lg"
                formAction={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                Sign in w/ Google
              </Button>

              <Link href={`/view/events/`} className="block text-center">
                <Button size="lg" variant="secondary">
                  View Myschievia '24 Events
                </Button>
              </Link>

              <Dialog>
                <DialogTrigger className="underline">
                  <span className="text-destructive">* </span>You must sign in
                  with chrome, safari, or firefox
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>What do you mean?</DialogTitle>
                    <DialogDescription>
                      Google sign in (Google Oauth2) is not supported in all
                      browsers. We recommend using Chrome, Safari, or Firefox to
                      sign in with Google.
                    </DialogDescription>
                    <DialogTitle>
                      It doesn't seem to work when I open the link from
                      messenger?
                    </DialogTitle>
                    <DialogDescription>
                      Messenger is an "embedded browser" so google Oauth2
                      doesn't like it for security reasons.
                    </DialogDescription>
                    <DialogTitle>How do I do get around this?</DialogTitle>
                    <DialogDescription>
                      Open Chrome, Safari, or Firefox and manually navigate to
                      tribalcities.com and try there
                    </DialogDescription>
                    <DialogTitle>Why not edge or internet explore?</DialogTitle>
                    <DialogDescription>
                      Because why are you using those still?
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger className="underline">
                  What we collect
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>What will we collect?</DialogTitle>
                    <DialogDescription>
                      We collect your email address and name. We will not share
                      your information with anyone. We will only use it to be
                      able to communicate with you effectively and provide you
                      with a better user experience over all.
                    </DialogDescription>
                    <DialogDescription>
                      We will not spam you. We do not sell your information. We
                      will not display your name or email address to anyone.
                    </DialogDescription>
                    <DialogDescription>
                      We may use your email to send you important information
                      about your account, events or camps you register, create,
                      or join.
                    </DialogDescription>
                    <DialogDescription>
                      Upon creating an account, you will be be able to set your
                      burn name. We will only display this name to other users.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted bg-gradient-to-r from-secondary to-primary dark:from-primary dark:to-secondary lg:block">
        {/* <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
      </div>
    </div>
  );
}
