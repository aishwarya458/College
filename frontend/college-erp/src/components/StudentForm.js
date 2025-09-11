// StudentForm.js
import React, { Component } from "react";
import "./StudentForm.css";

class StudentForm extends Component {
  state = {
    name: "",
    email: "",
    course: ""
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submit = (e) => {
    e.preventDefault();
    const { name, email, course } = this.state;
    if (!name.trim() || !email.trim() || !course.trim()) return;
    this.props.onSubmit({
      name: name.trim(),
      email: email.trim(),
      course: course.trim()
    });
    this.setState({ name: "", email: "", course: "" });
  };

  render() {
    return (
      <form className="student-form" onSubmit={this.submit}>
        <h3>Add Student</h3>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            value={this.state.email}
            onChange={this.handleChange}
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="course">Select Course</label>
          <select
            id="course"
            name="course"
            value={this.state.course}
            onChange={this.handleChange}
          >
            <option value="">-- Choose a course --</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Data Science">Data Science</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile App Development">Mobile App Development</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Game Development">Game Development</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="add-button">Create</button>
          <button type="button" className="cancel-button" onClick={this.props.onCancel}>Cancel</button>
        </div>
      </form>
    );
  }
}

export default StudentForm;
