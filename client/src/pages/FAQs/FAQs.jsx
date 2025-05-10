import React from 'react';
import { Link } from 'react-router-dom';
import './FAQs.css';
import Navbar from '../../components/Navbar';

export default function FAQs() {
    const faqsList = [
        {
            question: "Can I cancel my meal after booking it?",
            answer: "No, once booked, you will be charged even if you don't show up."
        },
        {
            question: "What happens if I don't confirm my meal before 10:00 AM?",
            answer: "You won't be able to eat in the mess for that meal."
        },
        {
            question: "Can I take my food to my room or outside?",
            answer: "No, all meals must be eaten inside the mess."
        },
        {
            question: "What should I do after finishing my meal?",
            answer: "Return your plates and spoons to their designated place."
        },
        {
            question: "Can I come late and still get my meal?",
            answer: "No, food is served only during the set meal timings."
        },
        {
            question: "Who should I contact for any issues or complaints?",
            answer: "You can report to the mess management or leave feedback through the complaint system."
        }
    ]; return (
        <div className="faqs-container">
            <Navbar />

            <div className="faqs-content">
                <div className="faqs-card">
                    <Link to="/dashboard" className="back-button">
                        <span>←</span>
                    </Link>

                    <h1 className="card-title">FAQs (Frequently Asked Questions)</h1>

                    <div className="faqs-list">
                        {faqsList.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <div className="faq-question">
                                    <p><strong>Q{index + 1}: {faq.question}</strong></p>
                                </div>
                                <div className="faq-answer">
                                    <p>A: {faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}