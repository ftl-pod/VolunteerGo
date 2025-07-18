import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { SignUp, useSignUp } from '@clerk/clerk-react';

function SignupPage() {
  const navigate = useNavigate();
  const { isLoaded, signUp } = useSignUp();

  return (
    <>
      <div className="auth-page-container">
        <div className="auth-left">
            <div className="left-pic">
            <img src="https://i.postimg.cc/fWvtkTqv/image.jpg" alt="logo-placeholder" className="logo-placeholder"/>
          </div> 
        </div>
        <div className="auth-right">
          <div className="w-full h-full flex items-center justify-center">
          <SignUp
            signInUrl="/login"
            fallbackRedirectUrl="/onboarding" 
          />
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
