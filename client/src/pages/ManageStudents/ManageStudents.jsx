import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../../components/receptionist/ReceptionistLayout";
import "./ManageStudents.css";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filterHostel, setFilterHostel] = useState("");
  const [filterDegree, setFilterDegree] = useState("");
  const [newStudent, setNewStudent] = useState({
    regNo: "",
    name: "",
    email: "",
    password: "",
    degree: "",
    hostel: "",
  });

  // Available degrees and hostels
  const [degrees, setDegrees] = useState([]);
  const [hostels, setHostels] = useState([]);

  // Fetch students, degrees, and hostels on component mount
  useEffect(() => {
    Promise.all([fetchStudents(), fetchDegrees(), fetchHostels()]);
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:4000/api/students");
      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDegrees = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/degrees");
      if (!response.ok) {
        throw new Error("Failed to fetch degrees");
      }

      const data = await response.json();
      setDegrees(data.map((d) => d.department_name));
    } catch (err) {
      console.error("Error fetching degrees:", err);
      // Use default degrees if API fails
      setDegrees([
        "Software Engineering",
        "Computer Science",
        "Electrical Engineering",
        "Mechanical Engineering",
        "Materials Engineering",
        "Engineering Sciences",
        "Management Sciences",
        "Artificial Intelligence",
      ]);
    }
  };

  const fetchHostels = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/hostels");
      if (!response.ok) {
        throw new Error("Failed to fetch hostels");
      }

      const data = await response.json();
      setHostels(data.map((h) => h.hostel_name));
    } catch (err) {
      console.error("Error fetching hostels:", err);
      // Use default hostels if API fails
      setHostels([
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "H7",
        "H8",
        "H9",
        "H10",
        "H11",
        "H12",
      ]);
    }
  };

  // Filter students based on search query and filters
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      student.name.toLowerCase().includes(query) ||
      student.reg_no.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query);

    const matchesHostel = filterHostel
      ? student.hostel_name === filterHostel
      : true;
    const matchesDegree = filterDegree
      ? student.department_name === filterDegree
      : true;

    return matchesSearch && matchesHostel && matchesDegree;
  });

  const handleAddStudent = async () => {
    const { regNo, name, email, password, degree, hostel } = newStudent;

    if (!regNo || !name || !email || !password || !degree || !hostel) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError(null);
      const response = await fetch("http://localhost:4000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reg_no: regNo,
          name,
          email,
          password,
          degree,
          hostel_name: hostel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add student");
      }

      const result = await response.json();

      // Refresh students list
      fetchStudents();

      // Reset form
      setNewStudent({
        regNo: "",
        name: "",
        email: "",
        password: "",
        degree: "",
        hostel: "",
      });

      setSuccessMessage("Student added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error adding student:", err);
      setError(err.message || "Failed to add student. Please try again.");
    }
  };

  const handleDeleteStudent = async (regNo) => {
    if (
      window.confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    ) {
      try {
        setError(null);
        const response = await fetch(
          `http://localhost:4000/api/students/${regNo}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete student");
        }

        // Remove student from local state
        setStudents(students.filter((s) => s.reg_no !== regNo));
        setSuccessMessage("Student deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        console.error("Error deleting student:", err);
        setError("Failed to delete student. Please try again.");
      }
    }
  };

  const handleViewBill = (student) => {
    // This would typically navigate to a detailed bill view in a real application
    window.open(`/receptionist/bill/${student.reg_no}`, "_blank");
  };

  const handleEditStudent = (student) => {
    // This would typically open a modal or navigate to edit page in a real application
    alert(`Edit functionality for ${student.name} would be implemented here`);
  };

  const handleApplyFilters = () => {
    // Reset search when applying filters for clarity
    setSearchQuery("");
  };

  const handleResetFilters = () => {
    setFilterHostel("");
    setFilterDegree("");
    setSearchQuery("");
  };

  return (
    <ReceptionistLayout activeTab="students">
      <h1 className="page-title">Manage Students</h1>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="students-container">
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name or reg. number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn search-btn">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="filter-actions">
            <select
              value={filterHostel}
              onChange={(e) => setFilterHostel(e.target.value)}
            >
              <option value="">Filter by Hostel</option>
              {hostels.map((hostel) => (
                <option key={hostel} value={hostel}>
                  {hostel}
                </option>
              ))}
            </select>

            <select
              value={filterDegree}
              onChange={(e) => setFilterDegree(e.target.value)}
            >
              <option value="">Filter by Degree</option>
              {degrees.map((degree) => (
                <option key={degree} value={degree}>
                  {degree}
                </option>
              ))}
            </select>

            <button className="btn primary sm" onClick={handleApplyFilters}>
              Apply
            </button>
            <button className="btn secondary sm" onClick={handleResetFilters}>
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-indicator">Loading students...</div>
        ) : (
          <div className="students-table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Reg No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Degree</th>
                  <th>Hostel</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.reg_no}>
                      <td>{student.reg_no}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.department_name}</td>
                      <td>{student.hostel_name}</td>
                      <td className="actions">
                        <button
                          className="btn icon-btn small"
                          title="View Bill"
                          onClick={() => handleViewBill(student)}
                        >
                          <i className="fas fa-file-invoice-dollar"></i>
                        </button>
                        <button
                          className="btn icon-btn small warning"
                          title="Edit Student"
                          onClick={() => handleEditStudent(student)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn icon-btn small danger"
                          title="Delete Student"
                          onClick={() => handleDeleteStudent(student.reg_no)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-results">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="add-student-section">
          <h2>Add New Student</h2>
          <div className="add-student-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="regNo">Registration Number</label>
                <input
                  id="regNo"
                  type="text"
                  value={newStudent.regNo}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, regNo: e.target.value })
                  }
                  placeholder="e.g. 2023XXX"
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                  placeholder="Student's full name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, email: e.target.value })
                  }
                  placeholder="Student's email"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={newStudent.password}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, password: e.target.value })
                  }
                  placeholder="Initial password"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="degree">Degree Program</label>
                <select
                  id="degree"
                  value={newStudent.degree}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, degree: e.target.value })
                  }
                >
                  <option value="">Select Degree</option>
                  {degrees.map((degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="hostel">Hostel</label>
                <select
                  id="hostel"
                  value={newStudent.hostel}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, hostel: e.target.value })
                  }
                >
                  <option value="">Select Hostel</option>
                  {hostels.map((hostel) => (
                    <option key={hostel} value={hostel}>
                      {hostel}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn primary" onClick={handleAddStudent}>
                <i className="fas fa-user-plus"></i> Add Student
              </button>
              <button
                className="btn secondary"
                onClick={() =>
                  setNewStudent({
                    regNo: "",
                    name: "",
                    email: "",
                    password: "",
                    degree: "",
                    hostel: "",
                  })
                }
              >
                <i className="fas fa-redo"></i> Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </ReceptionistLayout>
  );
}
