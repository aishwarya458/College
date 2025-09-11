import React, { Component } from "react";
import { withRouter,Redirect } from "react-router-dom";
import "./Login.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
    error: "",
    loading: false
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value, error: "" });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true, error: "" });
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: this.state.email, password: this.state.password })
      });
      if (!res.ok) {
        const text = await res.text();
        this.setState({ error: text || "Login failed", loading: false });
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      if (data.role === "admin") this.props.history.push("/admin");
      else this.props.history.push("/student");
    } catch (err) {
      this.setState({ error: "Network error", loading: false });
    }
  };

  render() {
      const { email, password, error, loading } = this.state;
      const isValidUser = localStorage.getItem("token")
      const role = localStorage.getItem("role")
      if (isValidUser !== undefined) {
          if (role === "student") {
              return <Redirect to="/student" />
          } else if (role === "admin") {return  <Redirect to="/admin" /> }
      }
    return (
      <div className="form-wrap">
        <form className="form-card" onSubmit={this.handleSubmit}>
          <h2 className="form-title">Log in</h2>
          {error && <div className="form-error">{error}</div>}
          <label className="form-label">
            Email
            <input className="form-input" name="email" value={email} onChange={this.handleChange} />
          </label>
          <label className="form-label">
            Password
            <input className="form-input" name="password" type="password" value={password} onChange={this.handleChange} />
          </label>
          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <button className="btn ghost" type="button" onClick={() => this.props.history.push("/signup")}>
              Create account
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
