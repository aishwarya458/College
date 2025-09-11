import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./components/NotFound";
import "./App.css";
import HomeRedirect from "./components/HomeRedirect";

class App extends Component {


  render() {
    

    return (
      <BrowserRouter>
        <div className="app-root">
          <NavBar />
          <main className="app-main">
            <Switch>
              <Route exact path="/" component={HomeRedirect} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <PrivateRoute path="/admin" component={AdminDashboard} allowedRoles={["admin"]} />
              <PrivateRoute path="/student" component={StudentDashboard} allowedRoles={["student"]} />
              <Route to="/not-found" component={NotFound} />
              <Redirect to="/not-found" />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
