import React from "react";
import { Route, Redirect } from "react-router-dom";


function PrivateRoute({ component: Component, allowedRoles, ...rest }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <Route
      {...rest}
      render={props =>
        token && (!allowedRoles || allowedRoles.includes(role)) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default PrivateRoute;
