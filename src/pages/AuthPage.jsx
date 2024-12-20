import { SignIn, SignUp } from "@clerk/clerk-react"; // Import Clerk's SignIn and SignUp components

// A reusable AuthPage component that renders SignIn or SignUp based on the `isSignUp` prop
export default function AuthPage({ isSignUp }) {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {/* Container for the form with proper margin and padding */}
      <div className="w-full sm:w-[80%] md:w-[450px] mt-6  rounded-lg">
        {/* SignUp or SignIn form */}
        {isSignUp ? <SignUp /> : <SignIn />}
      </div>
    </div>
  );
}
