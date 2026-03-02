import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

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
    const auth = useAuth();
    // Auto-redirect to Authorization Server immediately when component mounts
    useEffect(() => {
        auth.signinRedirect();
    }, [auth]);

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
