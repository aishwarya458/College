import React, { Component } from "react";
import StudentForm from "../components/StudentForm";
import StudentTable from "../components/StudentTable";
import EditStudentModal from "../components/EditStudentModal";
import DeleteConfirmation from "../components/DeleteConfirmation";
import "./AdminDashboard.css";

class AdminDashboard extends Component {
  state = {
    activeSection: "overview",
    students: [],
    loading: false,
    error: "",
    editingStudent: null,
    deletingStudent: null,
    showAddForm: false
  };

  componentDidMount() {
    this.loadStudents();
  }

  loadStudents = () => {
    this.setState({ loading: true, error: "" });
    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/admin/students", {
      headers: { Authorization: "Bearer " + token }
    })
      .then((res) => {
        if (!res.ok) return res.text().then((t) => Promise.reject(t || "Failed"));
        return res.json();
      })
      .then((data) => this.setState({ students: data, loading: false }))
      .catch((err) => this.setState({ error: String(err), loading: false }));
  };

  openSection = (name) => {
    this.setState({ activeSection: name });
  };

  toggleAddForm = () => {
    this.setState((s) => ({ showAddForm: !s.showAddForm }));
  };

  addStudent = (payload) => {
    const token = localStorage.getItem("token");
    const body = {
      name: payload.name,
      email: payload.email,
      password: "TempPass@123",
      role: "student",
      course: payload.course
    };
    fetch("http://localhost:3001/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify(body)
    })
      .then((res) => {
        if (!res.ok) return res.text().then((t) => Promise.reject(t || "Failed"));
        return res.text();
      })
      .then(() => {
        this.setState({ showAddForm: false });
        this.loadStudents();
      })
      .catch((err) => this.setState({ error: String(err) }));
  };

  requestEdit = (student) => {
    this.setState({ editingStudent: student });
  };

  saveEdit = (updated) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3001/admin/students/${updated.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ name: updated.name, email: updated.email, course: updated.course })
    })
      .then((res) => {
        if (!res.ok) return res.text().then((t) => Promise.reject(t || "Failed"));
        return res.text();
      })
      .then(() => {
        this.setState({ editingStudent: null });
        this.loadStudents();
      })
      .catch((err) => this.setState({ error: String(err) }));
  };

  cancelEdit = () => {
    this.setState({ editingStudent: null });
  };

  requestDelete = (student) => {
    this.setState({ deletingStudent: student });
  };

  confirmDelete = () => {
    const token = localStorage.getItem("token");
    const id = this.state.deletingStudent && this.state.deletingStudent.id;
    if (!id) return;
    fetch(`http://localhost:3001/admin/students/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    })
      .then((res) => {
        if (!res.ok) return res.text().then((t) => Promise.reject(t || "Failed"));
        return res.text();
      })
      .then(() => {
        this.setState({ deletingStudent: null });
        this.loadStudents();
      })
      .catch((err) => this.setState({ error: String(err), deletingStudent: null }));
  };

  cancelDelete = () => {
    this.setState({ deletingStudent: null });
  };

  renderOverview = () => {
    const total = this.state.students.length;
    return (
      <div className="overview-wrap">
        <div className="overview-head">
          <h1>Dashboard</h1>
          <div className="overview-sub">Welcome back! Here's what's happening at your college today.</div>
        </div>

        <div className="cards-grid">
          <div className="card">
            <div className="card-title">Total Students</div>
            <div className="card-value">{total}</div>
            <div className="card-note">+12.5% from last month</div>
          </div>

          <div className="card">
            <div className="card-title">Faculty Members</div>
            <div className="card-value">147</div>
            <div className="card-note">+2.1% from last month</div>
          </div>

          <div className="card">
            <div className="card-title">Departments</div>
            <div className="card-value">12</div>
            <div className="card-note">No change from last month</div>
          </div>

          <div className="card">
            <div className="card-title">Fees Collected</div>
            <div className="card-value">₹45.2L</div>
            <div className="card-note">+8.3% from last month</div>
          </div>
        </div>
      </div>
    );
  };

  renderStudentsSection = () => {
    const { students, loading, error, showAddForm } = this.state;
    return (
      <div className="students-wrap">
        <div className="section-head">
          <h2>Students</h2>
          <div>
            <button className="btn btn-outline" onClick={this.toggleAddForm}>
              {showAddForm ? "Close" : "Add Student"}
            </button>
            <button className="btn" onClick={this.loadStudents}>Refresh</button>
          </div>
        </div>

        {error && <div className="section-error">{error}</div>}

        {showAddForm && <StudentForm onSubmit={this.addStudent} onCancel={this.toggleAddForm} />}

        {loading ? (
          <div className="section-empty">Loading...</div>
        ) : students.length === 0 ? (
          <div className="section-empty">No students yet</div>
        ) : (
          <StudentTable students={students} onEdit={this.requestEdit} onDelete={this.requestDelete} />
        )}
      </div>
    );
  };

  renderMain = () => {
    return this.state.activeSection === "overview" ? this.renderOverview() : this.renderStudentsSection();
  };

  render() {
    const active = this.state.activeSection;
    return (
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="brand-block">
            <div className="brand-title">College ERP</div>
            <div className="brand-sub">Admin Dashboard</div>
          </div>
          <ul className="menu-list">
            <li className={active === "overview" ? "active" : ""} onClick={() => this.openSection("overview")}>Dashboard</li>
            <li className={active === "students" ? "active" : ""} onClick={() => this.openSection("students")}>Students</li>
            <li>Departments</li>
            <li>Subjects</li>
            <li className="menu-spacer">Settings</li>
          </ul>
        </aside>

        <main className="admin-main">{this.renderMain()}</main>

        {this.state.editingStudent && (
          <EditStudentModal
            student={this.state.editingStudent}
            onSave={this.saveEdit}
            onClose={this.cancelEdit}
          />
        )}

        {this.state.deletingStudent && (
          <DeleteConfirmation
            student={this.state.deletingStudent}
            onConfirm={this.confirmDelete}
            onCancel={this.cancelDelete}
          />
        )}
      </div>
    );
  }
}

export default AdminDashboard;
