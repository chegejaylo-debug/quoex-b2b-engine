import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05060F] py-12 px-4">
      <SignIn />
    </div>
  );
}
