import React, { Component } from "react";
import "./DeleteConfirmation.css";

class DeleteConfirmation extends Component {
  render() {
    const name = this.props.student ? this.props.student.name : "this student";
    return (
      <div className="confirm-backdrop" onClick={this.props.onCancel}>
        <div className="confirm-card" onClick={(e)=>e.stopPropagation()}>
          <div className="confirm-title">Delete {name}?</div>
          <div className="confirm-text">This action cannot be undone.</div>
          <div className="confirm-actions">
            <button className="btn btn-danger" onClick={this.props.onConfirm}>Delete</button>
            <button className="btn btn-outline" onClick={this.props.onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default DeleteConfirmation;
