import React, { useState } from 'react';
import ReceptionistLayout from '../../components/receptionist/ReceptionistLayout';
import './ManageRules.css';

export default function ManageRules() {
  // Demo data
  const [rules, setRules] = useState([
    { id: 1, title: 'Meal Booking', description: 'If you want to eat in the mess for lunch or dinner, you must confirm before 10:00 AM.', priority: 1 },
    { id: 2, title: 'Cancellation', description: 'If you booked a meal but don\'t show up, you will still be charged for it.', priority: 2 },
    { id: 3, title: 'Mess Timings', description: 'Breakfast: 7:30 AM - 9:30 AM, Lunch: 12:30 PM - 2:30 PM, Dinner: 7:30 PM - 9:30 PM', priority: 1 },
  ]);
  
  const [newRule, setNewRule] = useState({ title: '', description: '', priority: 5 });
  const [editingRule, setEditingRule] = useState(null);
  
  const handleAddRule = () => {
    if (!newRule.title || !newRule.description) {
      alert('Please fill in all fields');
      return;
    }
    
    const rule = {
      id: rules.length + 1,
      ...newRule
    };
    
    setRules([...rules, rule]);
    setNewRule({ title: '', description: '', priority: 5 });
  };
  
  const handleEditRule = (rule) => {
    setEditingRule(rule);
  };
  
  const handleUpdateRule = () => {
    if (!editingRule.title || !editingRule.description) {
      alert('Please fill in all fields');
      return;
    }
    
    const updatedRules = rules.map(rule => 
      rule.id === editingRule.id ? editingRule : rule
    );
    
    setRules(updatedRules);
    setEditingRule(null);
  };
  
  const handleDeleteRule = (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      const updatedRules = rules.filter(rule => rule.id !== id);
      setRules(updatedRules);
    }
  };
  
  return (
    <ReceptionistLayout activeTab="rules">
      <h1 className="page-title">Manage Mess Rules</h1>
      
      <div className="rules-container">
        <div className="rules-section">
          <h2>Current Rules</h2>
          <div className="rules-list">
            {rules.map(rule => (
              <div className="rule-card" key={rule.id}>
                <div className="rule-content">
                  <div className="rule-header">
                    <h3>{rule.title}</h3>
                    <span className="priority-badge">Priority: {rule.priority}</span>
                  </div>
                  <p>{rule.description}</p>
                </div>
                <div className="rule-actions">
                  <button onClick={() => handleEditRule(rule)} className="btn icon-btn">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDeleteRule(rule.id)} className="btn icon-btn danger">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
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
                    onChange={e => setEditingRule({...editingRule, title: e.target.value})} 
                    placeholder="Rule Title"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={editingRule.description} 
                    onChange={e => setEditingRule({...editingRule, description: e.target.value})} 
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
                    onChange={e => setEditingRule({...editingRule, priority: parseInt(e.target.value)})} 
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handleUpdateRule} className="btn primary">Update Rule</button>
                  <button onClick={() => setEditingRule(null)} className="btn secondary">Cancel</button>
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
                    onChange={e => setNewRule({...newRule, title: e.target.value})} 
                    placeholder="Rule Title"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={newRule.description} 
                    onChange={e => setNewRule({...newRule, description: e.target.value})} 
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
                    onChange={e => setNewRule({...newRule, priority: parseInt(e.target.value)})} 
                  />
                </div>
                <div className="form-actions">
                  <button onClick={handleAddRule} className="btn primary">Add Rule</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ReceptionistLayout>
  );
}