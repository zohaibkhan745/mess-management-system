import React from 'react';
import { Link } from 'react-router-dom';
import './Rules.css';
import Navbar from '../../components/Navbar';

export default function Rules() {
    const messRules = [
        {
            title: "Meal Booking:",
            description: "If you want to eat in the mess for lunch or dinner, you must confirm before 10:00 AM."
        },
        {
            title: "Cancellation:",
            description: "If you booked a meal but don't show up, you will still be charged for it."
        },
        {
            title: "Mess Timings:",
            description: "Meals will be served at fixed timings. Latecomers will not be served."
        },
        {
            title: "Cleanliness:",
            description: "After eating, put your plates and spoons back in their place."
        },
        {
            title: "Food Policy:",
            description: "No one is allowed to take food outside from the mess."
        },
        {
            title: "Respect Staff:",
            description: "Be polite to the mess staff. Misbehavior will not be tolerated."
        },
        {
            title: "Special Requests:",
            description: "If you need a special meal (e.g., diet meal), inform the mess management in advance."
        }
    ];
    return (
        <div className="rules-container">
            <Navbar />
            <div className="rules-content">
                <div className="rules-card">
                    <Link to="/dashboard" className="back-button">
                        <span>←</span>
                    </Link>
                    <h1 className="card-title">Mess Rules & Guidelines</h1>
                    <div className="rules-list">
                        {messRules.map((rule, index) => (
                            <div key={index} className="rule-item">
                                <p>
                                    <span className="rule-number">{index + 1}. </span>
                                    <span className="rule-title">{rule.title} </span>
                                    {rule.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}