import React, { useState } from 'react';
import ReceptionistLayout from '../../components/receptionist/ReceptionistLayout';
import './ManageFAQs.css';

export default function ManageFAQs() {
  // Demo data
  const [faqs, setFaqs] = useState([
    { id: 1, question: 'Can I cancel my meal after booking it?', answer: 'No, once booked, you will be charged even if you don\'t show up.', is_featured: true },
    { id: 2, question: 'What happens if I don\'t confirm my meal before 10:00 AM?', answer: 'You won\'t be able to eat in the mess for that meal.', is_featured: false },
    { id: 3, question: 'How can I submit feedback about mess food?', answer: 'You can use the Feedback option in the student dashboard to submit your thoughts.', is_featured: true },
  ]);
  
  const [newFaq, setNewFaq] = useState({ question: '', answer: '', is_featured: false });
  const [editingFaq, setEditingFaq] = useState(null);
  
  const handleAddFaq = () => {
    if (!newFaq.question || !newFaq.answer) {
      alert('Please fill in both question and answer fields');
      return;
    }
    
    const faq = {
      id: faqs.length + 1,
      ...newFaq
    };
    
    setFaqs([...faqs, faq]);
    setNewFaq({ question: '', answer: '', is_featured: false });
  };
  
  const handleEditFaq = (faq) => {
    setEditingFaq(faq);
  };
  
  const handleUpdateFaq = () => {
    if (!editingFaq.question || !editingFaq.answer) {
      alert('Please fill in both question and answer fields');
      return;
    }
    
    const updatedFaqs = faqs.map(faq => 
      faq.id === editingFaq.id ? editingFaq : faq
    );
    
    setFaqs(updatedFaqs);
    setEditingFaq(null);
  };
  
  const handleDeleteFaq = (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      const updatedFaqs = faqs.filter(faq => faq.id !== id);
      setFaqs(updatedFaqs);
    }
  };
  
  return (
    <ReceptionistLayout activeTab="faqs">
      <h1 className="page-title">Manage FAQs</h1>
      
      <div className="faqs-container">
        <div className="faqs-section">
          <h2>Current FAQs</h2>
          <div className="faqs-list">
            {faqs.map(faq => (
              <div className="faq-card" key={faq.id}>
                <div className="faq-content">
                  <div className="faq-header">
                    <h3>{faq.question}</h3>
                    {faq.is_featured && <span className="featured-badge">Featured</span>}
                  </div>
                  <p>{faq.answer}</p>
                </div>
                <div className="faq-actions">
                  <button onClick={() => handleEditFaq(faq)} className="btn icon-btn">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => handleDeleteFaq(faq.id)} className="btn icon-btn danger">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
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
                    onChange={e => setEditingFaq({...editingFaq, question: e.target.value})} 
                    placeholder="Enter question"
                  />
                </div>
                <div className="form-group">
                  <label>Answer</label>
                  <textarea 
                    value={editingFaq.answer} 
                    onChange={e => setEditingFaq({...editingFaq, answer: e.target.value})} 
                    placeholder="Enter answer"
                  ></textarea>
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={editingFaq.is_featured} 
                      onChange={e => setEditingFaq({...editingFaq, is_featured: e.target.checked})} 
                    />
                    Feature this FAQ
                  </label>
                </div>
                <div className="form-actions">
                  <button onClick={handleUpdateFaq} className="btn primary">Update FAQ</button>
                  <button onClick={() => setEditingFaq(null)} className="btn secondary">Cancel</button>
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
                    onChange={e => setNewFaq({...newFaq, question: e.target.value})} 
                    placeholder="Enter question"
                  />
                </div>
                <div className="form-group">
                  <label>Answer</label>
                  <textarea 
                    value={newFaq.answer} 
                    onChange={e => setNewFaq({...newFaq, answer: e.target.value})} 
                    placeholder="Enter answer"
                  ></textarea>
                </div>
                <div className="form-group checkbox">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={newFaq.is_featured} 
                      onChange={e => setNewFaq({...newFaq, is_featured: e.target.checked})} 
                    />
                    Feature this FAQ
                  </label>
                </div>
                <div className="form-actions">
                  <button onClick={handleAddFaq} className="btn primary">Add FAQ</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ReceptionistLayout>
  );
}