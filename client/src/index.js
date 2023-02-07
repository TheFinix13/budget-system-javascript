import ReactDOM from "react-dom";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";
import AuthContextProvider from './contexts/AuthContext';
import Router from './Router';

import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASOfqHQBFHLIlMPNt1pvnMfIq_SfjyvFM",
  authDomain: "budget-system-91cb4.firebaseapp.com",
  projectId: "budget-system-91cb4",
  storageBucket: "budget-system-91cb4.appspot.com",
  messagingSenderId: "501459369077",
  appId: "1:501459369077:web:029735af7e7223dbed8c3c"
};

ReactDOM.render(
  <div style={{width:"100%",maxWidth:"100vw",height:"100vh"}}>
    <AuthContextProvider>
    <ThemeContextWrapper>
      <BackgroundColorWrapper>  
        <Router />
      </BackgroundColorWrapper>
    </ThemeContextWrapper>
    </AuthContextProvider>
  </div>
  ,
  document.getElementById("root")
);


// Initialize Firebase
const app = initializeApp(firebaseConfig);
