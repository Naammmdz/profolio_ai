import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';

const Callback: React.FC = () => {
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        // react-oidc-context v3 automatically handles the callback via AuthProvider
        // We just need to wait for authentication to complete and then redirect
        
        if (auth.isLoading) {
            return; // Still loading, wait
        }

        if (auth.isAuthenticated) {
            // Authentication successful, redirect to dashboard
            setStatus('success');
            setTimeout(() => {
                navigate('/dashboard');
            }, 500);
        } else if (auth.error) {
            // Authentication failed
            setStatus('error');
            setError(auth.error.message || 'Authentication failed');
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } else {
            // Not authenticated yet, but no error - might still be processing
            // Wait a bit more or check if we're in a callback state
            const timeout = setTimeout(() => {
                if (!auth.isAuthenticated && !auth.isLoading) {
                    setStatus('error');
                    setError('Authentication timeout. Please try again.');
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                }
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [auth.isLoading, auth.isAuthenticated, auth.error, navigate]);

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
