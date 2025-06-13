import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => <SignUp fallbackRedirectUrl={'/new-user'} />;

export default SignUpPage;