import React, { Component } from "react";
import "./EditStudentModal.css";

class EditStudentModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      id: props.student.id,
      name: props.student.name || "",
      email: props.student.email || "",
      course: props.student.course || ""
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  save = (e) => {
    e.preventDefault();
    this.props.onSave({ id: this.state.id, name: this.state.name.trim(), email: this.state.email.trim(), course: this.state.course.trim() });
  };

  render() {
    return (
      <div className="modal-backdrop" onClick={this.props.onClose}>
        <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
          <h3>Edit Student</h3>
          <form className="modal-form" onSubmit={this.save}>
            <label>
              Name
              <input name="name" value={this.state.name} onChange={this.handleChange} />
            </label>
            <label>
              Email
              <input name="email" value={this.state.email} onChange={this.handleChange} />
            </label>
            <label>
              Course
              <input name="course" value={this.state.course} onChange={this.handleChange} />
            </label>
            <div className="modal-actions">
              <button className="btn" type="submit">Save</button>
              <button type="button" className="btn btn-outline" onClick={this.props.onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default EditStudentModal;
