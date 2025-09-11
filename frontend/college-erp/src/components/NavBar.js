import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./NavBar.css";

class NavBar extends Component {
  state = {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  };

  componentDidMount() {
    this.syncAuthFromStorage();

    // Sync token/role on route change
    this.unlisten = this.props.history.listen(() => {
      this.syncAuthFromStorage();
    });
  }

  componentWillUnmount() {
    if (this.unlisten) this.unlisten();
  }

  syncAuthFromStorage = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    this.setState({ token, role });
  };

  logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    this.setState({ token: null, role: null });
    this.props.history.push("/login");
  };

  render() {
    const { token, role } = this.state;

    return (
      <header className="nav-header">
        <div className="nav-inner">
          <div className="brand">
            <Link to="/">College ERP</Link>
          </div>
          <nav className="nav-links">
            {!token && (
              <>
                <Link className="link" to="/login">Log in</Link>
                <Link className="link primary" to="/signup">Sign up</Link>
              </>
            )}
            {token && role === "admin" && (
              <>
                <Link className="link admin" to="/admin">Admin Dashboard</Link>
                <button className="link button-like" onClick={this.logout}>Logout</button>
              </>
            )}
            {token && role === "student" && (
              <>
                <Link className="profile" to="/student">My Profile</Link>
                <button className="link button-like" onClick={this.logout}>Logout</button>
              </>
            )}
          </nav>
        </div>
      </header>
    );
  }
}

export default withRouter(NavBar);
