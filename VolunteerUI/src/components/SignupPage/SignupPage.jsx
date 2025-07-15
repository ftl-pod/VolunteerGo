import "./Signup.css";
import { useNavigate } from "react-router-dom";
import { SignUp } from '@clerk/clerk-react';

function SignupPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="auth-page-container">
        <div className="auth-left">
            <img src="https://images.unsplash.com/photo-1524100880052-104a85d5ab82?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8" alt="logo-placeholder" className="logo-placeholder"/>
        </div>
        <div className="auth-right">
          <div className="w-full h-full flex items-center justify-center">
            <SignUp/>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
