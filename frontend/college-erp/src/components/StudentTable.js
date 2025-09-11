import React, { Component } from "react";
import "./StudentTable.css";

class StudentTable extends Component {
  render() {
    const { students, onEdit, onDelete } = this.props;
    return (
      <div className="table-card">
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Enrolled</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.course}</td>
                <td>{s.enrollment_date}</td>
                <td>
                  <button className="action edit" onClick={() => onEdit(s)}>Edit</button>
                  <button className="action delete" onClick={() => onDelete(s)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default StudentTable;
