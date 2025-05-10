import React from 'react';
import { Link } from 'react-router-dom';
import './ReceptionistDashboard.css';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';

export default function ReceptionistDashboard() {
    const { currentUser } = useAuth();

    return (
        <div className="receptionist-dashboard-container">
            <Navbar />

            <main className="receptionist-main">
                <div className="receptionist-menu-grid">
                    <Link to="/start-attendance" className="receptionist-menu-item">
                        <div className="receptionist-menu-content">
                            <h2>Start Attendance</h2>
                        </div>
                    </Link>

                    <Link to="/manual-in-student" className="receptionist-menu-item">
                        <div className="receptionist-menu-content">
                            <h2>Manual IN Student</h2>
                        </div>
                    </Link>

                    <Link to="/view-todays-attendance" className="receptionist-menu-item">
                        <div className="receptionist-menu-content">
                            <h2>View Today's Attendance</h2>
                        </div>
                    </Link>

                    <Link to="/search-student-record" className="receptionist-menu-item">
                        <div className="receptionist-menu-content">
                            <h2>Search Student Record</h2>
                        </div>
                    </Link>
                </div>
            </main>
        </div>
    );
}
