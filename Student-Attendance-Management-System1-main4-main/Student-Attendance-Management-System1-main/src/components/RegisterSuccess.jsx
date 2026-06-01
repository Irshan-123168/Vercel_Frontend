import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const RegisterSuccess = ({ onContinue }) => {
    return (
        <div 
            style={{ 
                minHeight: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                padding: '2.5rem 1.5rem',
                background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 40%, #db2777 75%, #ec4899 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Subtle background glow blobs */}
            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '450px', height: '450px', background: 'rgba(255,255,255,0.07)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', right: '-80px', width: '380px', height: '380px', background: 'rgba(0,0,0,0.12)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            
            {/* ── Main Card ── */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                style={{ 
                    maxWidth: '480px', 
                    width: '100%', 
                    padding: '3.5rem 2.5rem', 
                    background: 'white', 
                    boxShadow: '0 30px 70px rgba(0,0,0,0.28)',
                    textAlign: 'center',
                    borderRadius: '24px',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {/* ── Success Check Badge ── */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                    style={{ 
                        margin: '0 auto 2rem',
                        width: '80px',
                        height: '80px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/* Premium Circle SVG Checkmark */}
                    <svg 
                        width="48" 
                        height="48" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" fill="none" />
                        <polyline points="7.5 12 10.5 15 16.5 9" />
                    </svg>
                </motion.div>

                {/* ── Heading ── */}
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#111', marginBottom: '1rem', lineHeight: '1.2' }}>
                    Welcome Aboard!
                </h2>
                
                {/* ── Description ── */}
                <p style={{ color: '#4b5563', fontSize: '0.98rem', lineHeight: '1.65', marginBottom: '2.5rem', fontWeight: 500 }}>
                    Your institutional account has been successfully initialized. You're now ready to access the portal.
                </p>

                {/* ── Proceed to Sign In Button ── */}
                <motion.button 
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onContinue}
                    style={{ 
                        width: '100%',
                        height: '54px', 
                        fontWeight: 700, 
                        fontSize: '1.02rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        boxShadow: '0 6px 20px rgba(99, 102, 241, 0.35)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    Proceed to Sign In
                    {/* LogIn/ArrowRight icon with horizontal bracket */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowRight size={18} style={{ marginRight: '2px' }} />
                        <span style={{ fontSize: '1.1rem', fontWeight: '400', opacity: 0.8 }}>]</span>
                    </div>
                </motion.button>
                
                {/* ── Muted Footer Branding ── */}
                <p style={{ marginTop: '2.5rem', color: '#9ca3af', fontSize: '0.82rem', fontWeight: 600 }}>
                    Sanjay Gandhi Polytechnic • Attendance Flow
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterSuccess;
