import { GalleryVerticalEndIcon } from "lucide-react";
import Link from "next/link";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/"
                className="flex flex-col items-center gap-2 font-medium"
              >
                <div className="flex size-8 items-center justify-center rounded-md">
                  <GalleryVerticalEndIcon className="size-6" />
                </div>
                <span className="sr-only">Colhive</span>
              </Link>
              <h1 className="text-xl font-bold">Welcome to Colhive</h1>
              <div className="text-center text-sm">
                already have an account?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
          <SignupForm />
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}

