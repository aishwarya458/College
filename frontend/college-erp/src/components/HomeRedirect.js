
import React from "react";
import { Redirect } from "react-router-dom";

const HomeRedirect = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Redirect to="/login" />;
  }

  if (role === "student") {
    return <Redirect to="/student" />;
  } else if (role === "admin") {
    return <Redirect to="/admin" />;
  } else {
    return <Redirect to="/not-found" />;
  }
};

export default HomeRedirect;
