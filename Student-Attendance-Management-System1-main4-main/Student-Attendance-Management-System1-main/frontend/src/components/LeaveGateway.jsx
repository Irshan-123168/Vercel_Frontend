import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Plus, Clock, CheckCircle, XCircle, FileText, Send, User } from 'lucide-react';
import { api } from '../api';

const LeaveGateway = ({ user }) => {
    const [isApplying, setIsApplying] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [requests, setRequests] = useState([]);

    const [formData, setFormData] = useState({
        type: 'Educational Sync',
        duration: 1,
        startDate: new Date().toISOString().split('T')[0],
        reason: ''
    });

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            let data;
            // HOD and ADMIN see all requests
            if (user?.role === 'HOD' || user?.role === 'ADMIN') {
                data = await api.getLeaveRequests();
            } else {
                // Others see only their own
                data = await api.getFacultyLeaveRequests(user?.id);
            }
            setRequests(data);
        } catch (error) {
            console.error('Failed to load leave requests:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newRequest = {
                facultyId: user.id,
                facultyName: user.username,
                type: formData.type.split(' ')[0], // Extract first word
                reason: formData.reason,
                startDate: formData.startDate,
                duration: parseInt(formData.duration),
                appliedDate: new Date().toISOString().split('T')[0]
            };
            await api.createLeaveRequest(newRequest);
            setSuccessMessage(true);
            setIsApplying(false);
            setFormData({ type: 'Educational Sync', duration: 1, reason: '', startDate: new Date().toISOString().split('T')[0] });
            loadRequests();
            setTimeout(() => setSuccessMessage(false), 3000);
        } catch (error) {
            alert('Failed to submit leave request: ' + error.message);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.updateLeaveRequestStatus(id, 'Approved');
            loadRequests();
        } catch (error) {
            alert('Failed to approve request: ' + error.message);
        }
    };

    const handleDisapprove = async (id) => {
        try {
            await api.updateLeaveRequestStatus(id, 'Rejected');
            loadRequests();
        } catch (error) {
            alert('Failed to reject request: ' + error.message);
        }
    };

    const isAuthority = user?.role === 'HOD' || user?.role === 'ADMIN';

    return (
        <div className="animate-fade space-y-8">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Leave Gateway</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage permission protocols and absence telemetry</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <AnimatePresence>
                        {successMessage && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                style={{ color: 'var(--success-color)', fontWeight: 800, fontSize: '0.875rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px' }}
                            >
                                <CheckCircle size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                                Sent Successfully
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button 
                        onClick={() => setIsApplying(true)}
                        className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '14px' }}
                    >
                        <Plus size={20} />
                        New Permission
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Ledger */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Active Ledger</h3>
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                            <div className="animate-spin" style={{ display: 'inline-block', marginBottom: '1rem' }}><Clock size={32} /></div>
                            <p style={{ fontWeight: 600 }}>Synchronizing Security Ledger...</p>
                        </div>
                    ) : requests.length > 0 ? (
                        requests.map((req, idx) => (
                            <motion.div 
                                key={req.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="card"
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '1rem' }}>{req.type} Authorization</p>
                                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-light)', fontWeight: 500 }}>{req.reason}</p>
                                        {isAuthority && (
                                            <p style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 700, marginTop: '0.25rem' }}>
                                                BY: {req.facultyName || 'Unknown Faculty'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className={`badge badge-${req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'danger' : 'warning'}`}>
                                            {req.status}
                                        </span>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: 600 }}>{req.startDate}</p>
                                    </div>
                                    {isAuthority && req.status === 'Pending' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                onClick={() => handleApprove(req.id)}
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '8px', background: 'var(--success-color)', borderColor: 'var(--success-color)' }}
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleDisapprove(req.id)}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', borderRadius: '8px', color: 'var(--error-color)', borderColor: 'var(--error-color)' }}
                                            >
                                                Disapprove
                                            </button>
                                        </div>
                                    )}

                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}>
                            <ClipboardList size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-light)', opacity: 0.5 }} />
                            <p style={{ color: 'var(--text-light)', fontWeight: 600 }}>No permission protocols found in ledger.</p>
                        </div>
                    )}
                </div>

                {/* Gateway Stats */}
                <div className="space-y-6">
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Oversight Stats</h3>
                    <div className="card" style={{ background: 'var(--primary-gradient)', color: 'white', border: 'none' }}>
                        <p style={{ opacity: 0.8, fontSize: '0.875rem', fontWeight: 600 }}>Authorized Absence</p>
                        <h4 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '0.5rem' }}>14 Days</h4>
                        <div style={{ marginTop: '1.5rem', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px' }}>
                            <div style={{ width: '70%', height: '100%', background: 'white', borderRadius: '3px' }}></div>
                        </div>
                        <p style={{ fontSize: '0.75rem', marginTop: '1rem', fontWeight: 600 }}>REMAINING QUOTA: 06 DAYS</p>
                    </div>
                </div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {isApplying && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card" 
                            style={{ maxWidth: '500px', width: '100%', padding: '2.5rem' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontWeight: 800, fontSize: '1.25rem' }}>Permission Protocol</h3>
                                <button onClick={() => setIsApplying(false)} style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                                    <XCircle size={24} />
                                </button>
                            </div>
                            
                             <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Classification</label>
                                    <select 
                                        className="form-input"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option>Educational Sync</option>
                                        <option>Medical Override</option>
                                        <option>Personal Node Lag</option>
                                        <option>Others</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Start Date</label>
                                        <input 
                                            type="date" className="form-input"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Duration (Days)</label>
                                        <input 
                                            type="number" className="form-input" placeholder="1" 
                                            value={formData.duration}
                                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                            min="1"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Justification Memo</label>
                                    <textarea 
                                        className="form-input" rows="3" placeholder="Describe the reason for absence..."
                                        value={formData.reason}
                                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary w-full" style={{ height: '52px', marginTop: '1rem' }}>
                                    <Send size={18} />
                                    Initiate Request
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LeaveGateway;
