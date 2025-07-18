import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { SignIn } from "@clerk/clerk-react";

function LoginPage() {
  const navigate = useNavigate();

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
            <SignIn signUpUrl="/signup"/>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;

