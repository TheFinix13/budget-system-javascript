import ReactDOM from "react-dom";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";
import AuthContextProvider from './contexts/AuthContext';
import Router from './Router';
  
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
