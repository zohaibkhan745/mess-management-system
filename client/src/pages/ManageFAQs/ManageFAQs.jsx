import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../../components/receptionist/ReceptionistLayout";
import "./ManageFAQs.css";

export default function ManageFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    is_featured: false,
  });
  const [editingFaq, setEditingFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch FAQs from database on component mount
  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/faqs");

      if (!response.ok) {
        throw new Error("Failed to fetch FAQs");
      }

      const data = await response.json();
      setFaqs(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
      setError("Failed to load FAQs. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFaq = async () => {
    if (!newFaq.question || !newFaq.answer) {
      setError("Please fill in both question and answer fields");
      return;
    }

    try {
      setError(null);
      const response = await fetch("http://localhost:4000/api/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFaq),
      });

      if (!response.ok) {
        throw new Error("Failed to add FAQ");
      }

      const result = await response.json();

      // Update the local state with the new FAQ returned from the server
      setFaqs([...faqs, result.faq]);
      setNewFaq({ question: "", answer: "", is_featured: false });
      setSuccessMessage("FAQ added successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error adding FAQ:", err);
      setError("Failed to add FAQ. Please try again.");
    }
  };

  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
  };

  const handleUpdateFaq = async () => {
    if (!editingFaq.question || !editingFaq.answer) {
      setError("Please fill in both question and answer fields");
      return;
    }

    try {
      setError(null);
      const response = await fetch(
        `http://localhost:4000/api/faqs/${editingFaq.faq_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingFaq),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update FAQ");
      }

      const result = await response.json();

      // Update the local state with the updated FAQ
      const updatedFaqs = faqs.map((faq) =>
        faq.faq_id === editingFaq.faq_id ? result.faq : faq
      );

      setFaqs(updatedFaqs);
      setEditingFaq(null);
      setSuccessMessage("FAQ updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating FAQ:", err);
      setError("Failed to update FAQ. Please try again.");
    }
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      try {
        setError(null);
        const response = await fetch(`http://localhost:4000/api/faqs/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete FAQ");
        }

        // Update the local state by filtering out the deleted FAQ
        const updatedFaqs = faqs.filter((faq) => faq.faq_id !== id);
        setFaqs(updatedFaqs);
        setSuccessMessage("FAQ deleted successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        console.error("Error deleting FAQ:", err);
        setError("Failed to delete FAQ. Please try again.");
      }
    }
  };

  return (
    <ReceptionistLayout activeTab="faqs">
      <h1 className="page-title">Manage FAQs</h1>

      {loading ? (
        <div className="loading-indicator">Loading FAQs...</div>
      ) : (
        <div className="faqs-container">
          {error && <div className="error-message">{error}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <div className="faqs-section">
            <h2>Current FAQs</h2>
            <div className="faqs-list">
              {faqs.length === 0 ? (
                <p>No FAQs found. Add some FAQs to get started.</p>
              ) : (
                faqs.map((faq) => (
                  <div className="faq-card" key={faq.faq_id}>
                    <div className="faq-content">
                      <div className="faq-header">
                        <h3>{faq.question}</h3>
                        {faq.is_featured && (
                          <span className="featured-badge">Featured</span>
                        )}
                      </div>
                      <p>{faq.answer}</p>
                    </div>
                    <div className="faq-actions">
                      <button
                        onClick={() => handleEditFaq(faq)}
                        className="btn icon-btn"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(faq.faq_id)}
                        className="btn icon-btn danger"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="faq-form-section">
            {editingFaq ? (
              <>
                <h2>Edit FAQ</h2>
                <div className="faq-form">
                  <div className="form-group">
                    <label>Question</label>
                    <input
                      type="text"
                      value={editingFaq.question}
                      onChange={(e) =>
                        setEditingFaq({
                          ...editingFaq,
                          question: e.target.value,
                        })
                      }
                      placeholder="Enter question"
                    />
                  </div>
                  <div className="form-group">
                    <label>Answer</label>
                    <textarea
                      value={editingFaq.answer}
                      onChange={(e) =>
                        setEditingFaq({ ...editingFaq, answer: e.target.value })
                      }
                      placeholder="Enter answer"
                    ></textarea>
                  </div>
                  <div className="form-group checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={editingFaq.is_featured}
                        onChange={(e) =>
                          setEditingFaq({
                            ...editingFaq,
                            is_featured: e.target.checked,
                          })
                        }
                      />
                      Feature this FAQ
                    </label>
                  </div>
                  <div className="form-actions">
                    <button onClick={handleUpdateFaq} className="btn primary">
                      Update FAQ
                    </button>
                    <button
                      onClick={() => setEditingFaq(null)}
                      className="btn secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2>Add New FAQ</h2>
                <div className="faq-form">
                  <div className="form-group">
                    <label>Question</label>
                    <input
                      type="text"
                      value={newFaq.question}
                      onChange={(e) =>
                        setNewFaq({ ...newFaq, question: e.target.value })
                      }
                      placeholder="Enter question"
                    />
                  </div>
                  <div className="form-group">
                    <label>Answer</label>
                    <textarea
                      value={newFaq.answer}
                      onChange={(e) =>
                        setNewFaq({ ...newFaq, answer: e.target.value })
                      }
                      placeholder="Enter answer"
                    ></textarea>
                  </div>
                  <div className="form-group checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={newFaq.is_featured}
                        onChange={(e) =>
                          setNewFaq({
                            ...newFaq,
                            is_featured: e.target.checked,
                          })
                        }
                      />
                      Feature this FAQ
                    </label>
                  </div>
                  <div className="form-actions">
                    <button onClick={handleAddFaq} className="btn primary">
                      Add FAQ
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </ReceptionistLayout>
  );
}
