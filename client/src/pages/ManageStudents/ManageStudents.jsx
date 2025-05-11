import React, { useState } from 'react';
import ReceptionistLayout from '../../components/receptionist/ReceptionistLayout';
import './ManageStudents.css';

export default function ManageStudents() {
  // Demo student data
  const [students, setStudents] = useState([
    { regNo: '2023003', name: 'Azeeb Ali Malik', email: 'u2023003@giki.edu.pk', degree: 'Mechanical Engineering', hostel: 'H7' },
    { regNo: '2023007', name: 'Abdul Hakeem', email: 'u2023007@giki.edu.pk', degree: 'Computer Science', hostel: 'H11' },
    { regNo: '2023009', name: 'Abdul Moeed', email: 'u2023009@giki.edu.pk', degree: 'Materials Engineering', hostel: 'H3' },
    { regNo: '2023039', name: 'Abdullah Ihsan', email: 'u2023039@giki.edu.pk', degree: 'Software Engineering', hostel: 'H9' },
    { regNo: '2023066', name: 'Ali Hyder', email: 'u2023066@giki.edu.pk', degree: 'Electrical Engineering', hostel: 'H4' },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [newStudent, setNewStudent] = useState({
    regNo: '',
    name: '',
    email: '',
    password: '',
    degree: '',
    hostel: ''
  });
  
  // Available degrees and hostels
  const degrees = [
    'Software Engineering',
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Materials Engineering',
    'Engineering Sciences',
    'Management Sciences',
    'Artificial Intelligence'
  ];
  
  const hostels = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12'];
  
  // Filter students based on search query
  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.regNo.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
    );
  });
  
  const handleAddStudent = () => {
    const { regNo, name, email, password, degree, hostel } = newStudent;
    
    if (!regNo || !name || !email || !password || !degree || !hostel) {
      alert('Please fill in all fields');
      return;
    }
    
    // Check if reg number already exists
    if (students.some(student => student.regNo === regNo)) {
      alert('A student with this registration number already exists');
      return;
    }
    
    // Add new student
    setStudents([...students, newStudent]);
    
    // Reset form
    setNewStudent({
      regNo: '',
      name: '',
      email: '',
      password: '',
      degree: '',
      hostel: ''
    });
    
    alert('Student added successfully!');
  };
  
  const handleDeleteStudent = (regNo) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const updatedStudents = students.filter(student => student.regNo !== regNo);
      setStudents(updatedStudents);
    }
  };
  
  const handleViewBill = (student) => {
    // In a real app, this would navigate to the bill view or open a modal
    alert(`Viewing bill for ${student.name} (${student.regNo})`);
  };
  
  return (
    <ReceptionistLayout activeTab="students">
      <h1 className="page-title">Manage Students</h1>
      
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
            <select defaultValue="">
              <option value="" disabled>Filter by Hostel</option>
              {hostels.map(hostel => (
                <option key={hostel} value={hostel}>{hostel}</option>
              ))}
            </select>
            
            <select defaultValue="">
              <option value="" disabled>Filter by Degree</option>
              {degrees.map(degree => (
                <option key={degree} value={degree}>{degree}</option>
              ))}
            </select>
          </div>
        </div>
        
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
              {filteredStudents.map(student => (
                <tr key={student.regNo}>
                  <td>{student.regNo}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.degree}</td>
                  <td>{student.hostel}</td>
                  <td className="actions">
                    <button className="btn icon-btn small" title="View Bill" onClick={() => handleViewBill(student)}>
                      <i className="fas fa-file-invoice-dollar"></i>
                    </button>
                    <button className="btn icon-btn small warning" title="Edit Student">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn icon-btn small danger" title="Delete Student" onClick={() => handleDeleteStudent(student.regNo)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="no-results">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
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
                  onChange={(e) => setNewStudent({...newStudent, regNo: e.target.value})}
                  placeholder="e.g. 2023XXX" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input 
                  id="name"
                  type="text" 
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
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
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="Student's email" 
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  id="password"
                  type="password" 
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
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
                  onChange={(e) => setNewStudent({...newStudent, degree: e.target.value})}
                >
                  <option value="">Select Degree</option>
                  {degrees.map(degree => (
                    <option key={degree} value={degree}>{degree}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="hostel">Hostel</label>
                <select 
                  id="hostel"
                  value={newStudent.hostel}
                  onChange={(e) => setNewStudent({...newStudent, hostel: e.target.value})}
                >
                  <option value="">Select Hostel</option>
                  {hostels.map(hostel => (
                    <option key={hostel} value={hostel}>{hostel}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button className="btn primary" onClick={handleAddStudent}>
                <i className="fas fa-user-plus"></i> Add Student
              </button>
              <button className="btn secondary" onClick={() => setNewStudent({
                regNo: '', name: '', email: '', password: '', degree: '', hostel: ''
              })}>
                <i className="fas fa-redo"></i> Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </ReceptionistLayout>
  );
}