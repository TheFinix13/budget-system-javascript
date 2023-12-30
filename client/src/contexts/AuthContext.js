import React, { useState, useEffect, createContext, useContext } from "react";
import { authenticate, term } from "../data/api";
import Axios from "axios";
import GridLoader from "react-spinners/GridLoader";

import { Redirect } from "react-router-dom";

const AuthContext = createContext();
Axios.defaults.withCredentials = true;

export const useAuth = () => useContext(AuthContext);

function AuthContextProvider(props) {
  const [loggedIn, setLoggedIn] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetail, setUserDetail] = useState({});
  const [activeTerm, setActiveTerm] = useState(true);

  async function getLoggedIn() {
    Axios.defaults.headers.common["Authorization"] =
      localStorage.getItem("token");
    const loggedInRes = await Axios.get(authenticate.loggedIn);

    if (loggedInRes.data.status === false) {
      window.localStorage.removeItem("token");
      setLoggedIn(false);
      setUserDetail({});
      <Redirect to="/" />;
    } else {
      Axios.get(authenticate.getUserData).then(async (user) => {
        setUserDetail(user.data);
        setLoggedIn(true);
      });
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      Axios.defaults.headers.common["Authorization"] =
        localStorage.getItem("token");

      await Axios.get(authenticate.loggedIn).then(async (response) => {
        if (response.data.status === false) {
          window.localStorage.removeItem("token");
          setLoggedIn(false);
          <Redirect to="/" />;
        } else {
          //setting token to localStorage

          await Axios.get(authenticate.getUserData).then(async (user) => {
            await Axios.get(term.showActiveTerm + "/" + user.data.id).then(
              (response1) => {
                setLoggedIn(response.data);
                setUserDetail(user.data);
                if (response1.data.status) {
                  setActiveTerm(response1.data.data);
                } else {
                  setActiveTerm(false);
                }
              }
            );
          });
        }
        setIsLoading(false);
      });
    };
    fetchData();
  }, []);
  if (isLoading) {
    return (
      <div
        className="loaderDiv"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <GridLoader color={"white"} loading={true} size={40} />
      </div>
    );
  } else if (loggedIn !== undefined && activeTerm) {
    return (
      <AuthContext.Provider
        value={{
          loggedIn,
          getLoggedIn,
          userDetail,
          setUserDetail,
          activeTerm,
          setActiveTerm,
        }}
      >
        {props.children}
      </AuthContext.Provider>
    );
  } else {
    return (
      <div
        className="loaderDiv"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <GridLoader color={"white"} loading={true} size={40} />
        <br />
        Waiting for Authentication...
      </div>
    );
  }
}

export default AuthContextProvider;
