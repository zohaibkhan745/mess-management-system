import React, { useState, useEffect } from "react";
import ReceptionistLayout from "../../components/receptionist/ReceptionistLayout";
import "./ManageRules.css";

export default function ManageRules() {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({
    title: "",
    description: "",
    priority: 5,
  });
  const [editingRule, setEditingRule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch Rules from database on component mount
  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/rules");

      if (!response.ok) {
        throw new Error("Failed to fetch rules");
      }

      const data = await response.json();
      setRules(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching rules:", err);
      setError("Failed to load rules. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = async () => {
    if (!newRule.title || !newRule.description) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError(null);
      const response = await fetch("http://localhost:4000/api/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRule),
      });

      if (!response.ok) {
        throw new Error("Failed to add rule");
      }

      const result = await response.json();

      // Update the local state with the new rule returned from the server
      setRules([...rules, result.rule]);
      setNewRule({ title: "", description: "", priority: 5 });
      setSuccessMessage("Rule added successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error adding rule:", err);
      setError("Failed to add rule. Please try again.");
    }
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
  };

  const handleUpdateRule = async () => {
    if (!editingRule.title || !editingRule.description) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError(null);
      const response = await fetch(
        `http://localhost:4000/api/rules/${editingRule.rule_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingRule),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update rule");
      }

      const result = await response.json();

      // Update the local state with the updated rule
      const updatedRules = rules.map((rule) =>
        rule.rule_id === editingRule.rule_id ? result.rule : rule
      );

      setRules(updatedRules);
      setEditingRule(null);
      setSuccessMessage("Rule updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating rule:", err);
      setError("Failed to update rule. Please try again.");
    }
  };

  const handleDeleteRule = async (id) => {
    if (window.confirm("Are you sure you want to delete this rule?")) {
      try {
        setError(null);
        const response = await fetch(`http://localhost:4000/api/rules/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete rule");
        }

        // Update the local state by filtering out the deleted rule
        const updatedRules = rules.filter((rule) => rule.rule_id !== id);
        setRules(updatedRules);
        setSuccessMessage("Rule deleted successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        console.error("Error deleting rule:", err);
        setError("Failed to delete rule. Please try again.");
      }
    }
  };

  return (
    <ReceptionistLayout activeTab="rules">
      <h1 className="page-title">Manage Mess Rules</h1>

      {loading ? (
        <div className="loading-indicator">Loading rules...</div>
      ) : (
        <div className="rules-container">
          {error && <div className="error-message">{error}</div>}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          <div className="rules-section">
            <h2>Current Rules</h2>
            <div className="rules-list">
              {rules.length === 0 ? (
                <p>No rules found. Add some rules to get started.</p>
              ) : (
                rules.map((rule) => (
                  <div className="rule-card" key={rule.rule_id}>
                    <div className="rule-content">
                      <div className="rule-header">
                        <h3>{rule.title}</h3>
                        <span className="priority-badge">
                          Priority: {rule.priority}
                        </span>
                      </div>
                      <p>{rule.description}</p>
                    </div>
                    <div className="rule-actions">
                      <button
                        onClick={() => handleEditRule(rule)}
                        className="btn icon-btn"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.rule_id)}
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

          <div className="rule-form-section">
            {editingRule ? (
              <>
                <h2>Edit Rule</h2>
                <div className="rule-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={editingRule.title}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          title: e.target.value,
                        })
                      }
                      placeholder="Rule Title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={editingRule.description}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          description: e.target.value,
                        })
                      }
                      placeholder="Rule Description"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Priority (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editingRule.priority}
                      onChange={(e) =>
                        setEditingRule({
                          ...editingRule,
                          priority: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div className="form-actions">
                    <button onClick={handleUpdateRule} className="btn primary">
                      Update Rule
                    </button>
                    <button
                      onClick={() => setEditingRule(null)}
                      className="btn secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2>Add New Rule</h2>
                <div className="rule-form">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={newRule.title}
                      onChange={(e) =>
                        setNewRule({ ...newRule, title: e.target.value })
                      }
                      placeholder="Rule Title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={newRule.description}
                      onChange={(e) =>
                        setNewRule({ ...newRule, description: e.target.value })
                      }
                      placeholder="Rule Description"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Priority (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newRule.priority}
                      onChange={(e) =>
                        setNewRule({
                          ...newRule,
                          priority: parseInt(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                  <div className="form-actions">
                    <button onClick={handleAddRule} className="btn primary">
                      Add Rule
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
