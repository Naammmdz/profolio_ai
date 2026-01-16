import React, { useEffect } from 'react';
import { oauth2Service } from '../../src/services/oauth2Service';

interface LoginProps {
    onBack: () => void;
    onLogin: () => void;
    onSwitchToSignUp: () => void;
}

/**
 * Login Component - Auto-redirects to Authorization Server
 * The login form is handled by the Authorization Server
 * This follows OAuth2 Authorization Code Flow standard
 */
const Login: React.FC<LoginProps> = ({ onBack, onLogin, onSwitchToSignUp }) => {
    // Auto-redirect to Authorization Server immediately when component mounts
    useEffect(() => {
        oauth2Service.initiateLogin();
    }, []);

    // Minimal loading UI (will redirect immediately)
    return (
        <div className="relative min-h-screen w-full bg-background text-primary font-sans antialiased overflow-hidden flex items-center justify-center">
            <div className="text-center">
                <p className="text-text-muted">Redirecting to login...</p>
            </div>
        </div>
    );
};

export default Login;
