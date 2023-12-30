import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import loginImg from "./img/money.png";
//import logo from '../../assets/logo/White/Full White.svg';
import registerImg from "./img/calculator.svg";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Redirect } from "react-router-dom";
import "./auth.css";
import "../../assets/css/black-dashboard-react.css";
import "boxicons";

function Login() {
  const { getLoggedIn, loggedIn } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  if (loggedIn === true) {
    return <Redirect to="/admin/dashboard" />;
  }
  return (
    <div className="auth">
      <div className={isLogin ? "authcontainer" : "authcontainer sign-up-mode"}>
        <div className="forms-container">
          <div className="signin-signup">
            <LoginForm getLoggedIn={getLoggedIn} />
            <RegisterForm />
          </div>
        </div>
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>BUDGET AND EXPENDITURE SYSTEM</h3>
              <p>
                The budgeting system, that provides you the ability to keep
                track of your finances accordingly.
              </p>
              {/* <button
                className="btn-auth transparent"
                id="sign-up-btn"
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </button> */}
            </div>
            <img
              src={loginImg}
              style={{ height: "50vh" }}
              className="image"
              alt=""
            />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>Continue enjoying the perks of the fixtant system.</p>
              <button
                className="btn-auth transparent"
                id="sign-in-btn"
                onClick={() => setIsLogin(true)}
              >
                Sign in
              </button>
            </div>
            <img
              src={registerImg}
              style={{ padding: "10%" }}
              className="image"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
