import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, User, Lock, Mail, Smartphone, BadgeCheck, ArrowRight, X, ChevronDown, Rocket } from 'lucide-react';
import { api } from '../api';

const RegisterPage = ({ onRegister, onSwitchToLogin, onBackToHome }) => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [rollNumber, setRollNumber] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Access keys do not match.');
            return;
        }

        setIsLoading(true);
        try {
            const user = await api.register({
                username,
                password,
                email,
                role: role,
                phoneNumber,
                rollNumber
            });
            onRegister(user);
        } catch (err) {
            setError(err.message || 'Onboarding failure.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="animated-mesh"
            style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Animated Floating Orbs */}
            <div className="floating-orb" style={{ top: '10%', right: '10%', width: '300px', height: '300px', background: 'rgba(255, 255, 255, 0.15)', animationDelay: '0s' }}></div>
            <div className="floating-orb" style={{ bottom: '15%', left: '5%', width: '400px', height: '400px', background: 'rgba(0, 0, 0, 0.2)', animationDelay: '-5s' }}></div>
            <div className="floating-orb" style={{ top: '40%', left: '25%', width: '200px', height: '200px', background: 'rgba(6, 182, 212, 0.15)', animationDelay: '-12s' }}></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card animate-slide"
                style={{ 
                    maxWidth: '650px', 
                    width: '100%', 
                    padding: '3rem', 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '100%', height: 'auto', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: 'var(--shadow-sm)', overflow: 'hidden', padding: '1.5rem' }}>
                        <img src="/src/assets/logo.png" alt="Sanjay Gandhi Polytechnic Logo" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Portal Onboarding</h2>
                    <p style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Create your institutional node identity</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={16} />
                                <input 
                                    type="text" required
                                    className="form-input" style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Your Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <div style={{ position: 'relative' }}>
                                <BadgeCheck style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={16} />
                                <input 
                                    type="text" required
                                    className="form-input" style={{ paddingLeft: '2.5rem' }}
                                    placeholder="Unique ID"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={16} />
                            <input 
                                type="email" required
                                className="form-input" style={{ paddingLeft: '2.5rem' }}
                                placeholder="name@sgp.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Role Access</label>
                        <select 
                            className="form-input"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="STUDENT">Student</option>
                            <option value="TEACHER">Faculty</option>
                            <option value="HOD">HOD</option>
                            <option value="ADMIN">System Admin</option>
                        </select>
                    </div>

                    <AnimatePresence>
                        {role === 'STUDENT' && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden"
                            >
                                <div className="form-group">
                                    <label className="form-label">Roll Number</label>
                                    <input 
                                        type="text" required
                                        className="form-input"
                                        placeholder="SGP/..."
                                        value={rollNumber}
                                        onChange={(e) => setRollNumber(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Mobile Hub</label>
                                    <input 
                                        type="tel" required
                                        className="form-input"
                                        placeholder="+91..."
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Pin</label>
                            <input 
                                type="password" required
                                className="form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Verify Pin</label>
                            <input 
                                type="password" required
                                className="form-input"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: 'var(--error-color)', fontSize: '0.875rem', textAlign: 'center', fontWeight: 600 }}>{error}</p>}

                    <button 
                        type="submit" 
                        className="btn btn-primary w-full" 
                        style={{ height: '52px', fontWeight: 800, fontSize: '1.1rem' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Register'}
                        {!isLoading && <Rocket size={18} />}
                    </button>
                    
                    <button onClick={onBackToHome} className="btn btn-secondary w-full" style={{ height: '52px' }}>
                        Cancel & Return
                    </button>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Already have an account? {' '}
                            <button onClick={onSwitchToLogin} style={{ color: 'var(--primary-color)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
                                Sign In
                            </button>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
