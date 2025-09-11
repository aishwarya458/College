import React, { Component } from "react";
import "./StudentDashboard.css";

class StudentDashboard extends Component {
  state = {
    profile: null,
    loading: true,
    error: ""
  };

  componentDidMount() {
    this.loadProfile();
  }

  loadProfile = async () => {
    this.setState({ loading: true, error: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/student/me", {
        headers: { Authorization: "Bearer " + token }
      });
      if (!res.ok) {
        const text = await res.text();
        this.setState({ error: text || "Failed to fetch", loading: false });
        return;
      }
      const data = await res.json();
      this.setState({ profile: data, loading: false });
    } catch (err) {
      this.setState({ error: "Network error", loading: false });
    }
  };

  render() {
    const { profile, loading, error } = this.state;
    return (
      <div className="student-wrap">
        <h2>My profile</h2>
        {error && <div className="form-error">{error}</div>}
        {loading ? (
          <div className="form-empty">Loading...</div>
        ) : profile ? (
          <div className="profile-card">
            <div className="profile-row">
              <div className="field-title">Name</div>
              <div className="field-value">{profile.name}</div>
            </div>
            <div className="profile-row">
              <div className="field-title">Email</div>
              <div className="field-value">{profile.email}</div>
            </div>
            <div className="profile-row">
              <div className="field-title">Course</div>
              <div className="field-value">{profile.course}</div>
            </div>
            <div className="profile-row">
              <div className="field-title">Enrolled on</div>
              <div className="field-value">{profile.enrollment_date}</div>
            </div>
          </div>
        ) : (
          <div className="form-empty">No profile found</div>
        )}
      </div>
    );
  }
}

export default StudentDashboard;
