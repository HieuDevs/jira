
import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { getCurrentUser } from "@/features/auth/queries";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const user = await getCurrentUser();
  if (user) {
    return redirect("/");
  }
  return <SignUpCard />;
};
export default SignUpPage;
