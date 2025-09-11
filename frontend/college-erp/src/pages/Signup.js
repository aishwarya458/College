import React, { Component } from "react";
import { withRouter,Redirect } from "react-router-dom";
import "./Signup.css";

class Signup extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    role: "student",
    course: "",
    error: "",
    loading: false,
    success: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value, error: "", success: "" });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true, error: "", success: "" });
    const payload = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      role: this.state.role,
      course: this.state.role === "student" ? this.state.course : undefined
    };
    try {
      const res = await fetch("http://localhost:3001/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const text = await res.text();
        this.setState({ error: text || "Signup failed", loading: false });
        return;
      }
      this.setState({ success: "Account created. Redirecting to login...", loading: false });
      setTimeout(() => this.props.history.push("/login"), 900);
    } catch (err) {
      this.setState({ error: "Network error", loading: false });
    }
  };

  render() {
      const { name, email, password, role, course, error, loading, success } = this.state;
      const isValidUser = localStorage.getItem("token")
      const UserRole = localStorage.getItem("role")
      if (isValidUser !== undefined) {
        if (UserRole === "student") {
            return <Redirect to="/student" />
        } else if (UserRole === "admin") {return  <Redirect to="/admin" /> }
     }


    return (
      <div className="signup-wrap">
        <form className="signup-card" onSubmit={this.handleSubmit}>
          <h2 className="signup-title">Create an account</h2>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          <label className="form-label">
            Name
            <input className="form-input" name="name" value={name} onChange={this.handleChange} />
          </label>
          <label className="form-label">
            Email
            <input className="form-input" name="email" value={email} onChange={this.handleChange} />
          </label>
          <label className="form-label">
            Password
            <input className="form-input" type="password" name="password" value={password} onChange={this.handleChange} />
          </label>
          <label className="form-label">
            Role
            <select className="form-input" name="role" value={role} onChange={this.handleChange}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          {role === "student" && (
            <label className="form-label">
              Course
              <input className="form-input" name="course" value={course} onChange={this.handleChange} />
            </label>
          )}
          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(Signup);
