import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, LogIn } from 'lucide-react';

const RegisterSuccess = ({ onContinue }) => {
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card animate-slide"
                style={{ 
                    maxWidth: '500px', 
                    width: '100%', 
                    padding: '3.5rem 2.5rem', 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    textAlign: 'center',
                    borderRadius: '24px'
                }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                    style={{ 
                        margin: '0 auto 2rem',
                        width: '80px',
                        height: '80px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#22c55e'
                    }}
                >
                    <CheckCircle2 size={48} />
                </motion.div>

                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                    Welcome Aboard!
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem', fontWeight: 500 }}>
                    Your institutional account has been successfully initialized. You're now ready to access the portal.
                </p>

                <motion.button 
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onContinue}
                    className="btn btn-primary w-full" 
                    style={{ 
                        height: '56px', 
                        fontWeight: 800, 
                        fontSize: '1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                    }}
                >
                    Proceed to Sign In
                    <LogIn size={20} />
                </motion.button>
                
                <p style={{ marginTop: '2rem', color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: 600 }}>
                    Sanjay Gandhi Polytechnic • Attendance Flow
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterSuccess;
