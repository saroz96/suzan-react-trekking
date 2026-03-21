import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLocalError('');
    
  //   // Validation
  //   if (!userName.trim()) {
  //     setLocalError('Username is required');
  //     return;
  //   }
  //   if (!password.trim()) {
  //     setLocalError('Password is required');
  //     return;
  //   }

  //   try {
  //     await login(userName, password);
  //     // Redirect to home page on success
  //     navigate('/admin/dashboard');
  //   } catch (err) {
  //     // Error is handled by hook
  //     console.error('Login failed:', err);
  //   }
  // };

  // For demo purposes - quick fill admin credentials
  
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLocalError('');
  
  if (!userName.trim()) {
    setLocalError('Username is required');
    return;
  }
  if (!password.trim()) {
    setLocalError('Password is required');
    return;
  }

  try {
    await login(userName, password);
    // Redirect to dashboard on success
    navigate('/admin/dashboard');
  } catch (err) {
    console.error('Login failed:', err);
  }
};
  
  const fillAdminCredentials = () => {
    setUserName('Admin');
    setPassword('admin');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to continue your trekking adventure</p>
        </div>

        {/* Demo Credentials Banner */}
        <div style={styles.demoBanner}>
          <p style={styles.demoText}>
            <span style={styles.demoIcon}>🔐</span> 
            Demo: Use <strong>Admin</strong> / <strong>admin</strong>
          </p>
          <button onClick={fillAdminCredentials} style={styles.demoButton}>
            Fill Demo Credentials
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>👤</span>
              Username
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your username"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>🔒</span>
              Password
            </label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={styles.passwordInput}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {(localError || error) && (
            <div style={styles.errorContainer}>
              <span style={styles.errorIcon}>⚠️</span>
              <span style={styles.errorText}>{localError || error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
          >
            {loading ? (
              <span style={styles.loadingContent}>
                <span style={styles.spinner}></span>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px',
    padding: '40px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
  },
  demoBanner: {
    backgroundColor: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '10px',
  },
  demoText: {
    margin: 0,
    fontSize: '13px',
    color: '#0369a1',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  demoIcon: {
    fontSize: '16px',
  },
  demoButton: {
    backgroundColor: 'transparent',
    border: '1px solid #0369a1',
    color: '#0369a1',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#0369a1',
      color: 'white',
    },
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  labelIcon: {
    fontSize: '16px',
  },
  input: {
    padding: '12px 14px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    transition: 'border-color 0.2s',
    outline: 'none',
    ':focus': {
      borderColor: '#667eea',
    },
    ':disabled': {
      backgroundColor: '#f5f5f5',
      cursor: 'not-allowed',
    },
  },
  passwordContainer: {
    position: 'relative' as const,
    width: '100%',
  },
  passwordInput: {
    width: '100%',
    padding: '12px 14px',
    paddingRight: '45px',
    fontSize: '15px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    transition: 'border-color 0.2s',
    outline: 'none',
    boxSizing: 'border-box' as const,
    ':focus': {
      borderColor: '#667eea',
    },
  },
  passwordToggle: {
    position: 'absolute' as const,
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#666',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    border: '1px solid #ef4444',
    borderRadius: '6px',
    padding: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  errorIcon: {
    fontSize: '16px',
  },
  errorText: {
    color: '#dc2626',
    fontSize: '14px',
    flex: 1,
  },
  button: {
    backgroundColor: '#667eea',
    color: 'white',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '10px',
    ':hover': {
      backgroundColor: '#5a67d8',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
    },
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
    cursor: 'not-allowed',
    ':hover': {
      backgroundColor: '#a0aec0',
      transform: 'none',
      boxShadow: 'none',
    },
  },
  loadingContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '3px solid #ffffff',
    borderTop: '3px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  footer: {
    marginTop: '25px',
    textAlign: 'center' as const,
    borderTop: '1px solid #e0e0e0',
    paddingTop: '20px',
  },
  footerText: {
    fontSize: '14px',
    color: '#666',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
    ':hover': {
      textDecoration: 'underline',
    },
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Login;