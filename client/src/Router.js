import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import AdminLayout from "layouts/Admin/Admin.js";
import MinistryLayout from "layouts/Ministry/Ministry.js";
import Auth from "./views/auth/Auth";
import VerifyAccount from "./views/auth/VerifyAccount";
import ResetPassword from "./views/auth/ResetPassword";
import ForgotPassword from "./views/auth/ForgotPassword";

function RouterComp() {
  const { loggedIn, userDetail } = useAuth();
  return (
    <HashRouter>
      {!loggedIn ? (
        <Switch>
          <Route exact path="/" component={Auth} />
          <Route path="/accountverify/:verifyToken" component={VerifyAccount} />
          <Route path="/forgotpassword" component={ForgotPassword} />
          <Route path="/passwordreset/:resetToken" component={ResetPassword} />
          <Route component={Auth} />
        </Switch>
      ) : (
        <>
          {userDetail.type === "admin" ? (
            <Switch>
              <Route
                path="/admin"
                render={(props) => <AdminLayout {...props} />}
              />
              <Redirect to="/admin/dashboard/" />
            </Switch>
          ) : null}

          {userDetail.type === "ministry" ? (
            <Switch>
              <Route
                path="/ministry"
                render={(props) => <MinistryLayout {...props} />}
              />
              <Redirect to="/ministry/dashboard/" />
            </Switch>
          ) : null}
        </>
      )}
    </HashRouter>
  );
}
export default RouterComp;
