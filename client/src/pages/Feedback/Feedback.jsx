import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feedback.css';
import Navbar from '../../components/Navbar';

export default function Feedback() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would usually send the data to your backend
        console.log({ email, message });

        // Show success message
        setSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setEmail('');
            setMessage('');
            setSubmitted(false);
        }, 3000);
    };
    return (
        <div className="feedback-container">
            <Navbar />
            <div className="feedback-content">
                <div className="feedback-card">
                    <Link to="/dashboard" className="back-button">
                        <span>←</span>
                    </Link>

                    <h1 className="card-title">Complaints/Feedbacks</h1>

                    {submitted ? (
                        <div className="success-message">
                            <p>Thank you for your feedback! Your message has been submitted.</p>
                        </div>
                    ) : (
                        <form className="feedback-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <textarea
                                    id="message"
                                    placeholder="Write your complaint or Feedback here...."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows="10"
                                ></textarea>
                            </div>
                            <div className="form-group submit-group">
                                <button type="submit" className="submit-btn">Submit</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}