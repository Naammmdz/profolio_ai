import React, { useEffect, useState } from 'react';
import { oauth2Service } from '../../src/services/oauth2Service';
import { useNavigate } from 'react-router-dom';

const Callback: React.FC = () => {
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                await oauth2Service.handleCallback();
                setStatus('success');
                // Redirect to dashboard after successful login
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } catch (err: any) {
                setStatus('error');
                setError(err.message || 'Authentication failed');
                setTimeout(() => {
                    navigate('/auth');
                }, 3000);
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="relative min-h-screen w-full bg-background text-primary font-sans antialiased overflow-hidden flex items-center justify-center">
            <div className="text-center">
                {status === 'processing' && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-text-muted font-mono">Processing authentication...</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <div className="text-green-500 text-4xl mb-4">✓</div>
                        <p className="text-primary font-mono">Authentication successful! Redirecting...</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <div className="text-red-500 text-4xl mb-4">✗</div>
                        <p className="text-red-500 font-mono mb-2">Authentication failed</p>
                        <p className="text-text-muted text-sm">{error}</p>
                        <p className="text-text-muted text-xs mt-4">Redirecting to login...</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Callback;
