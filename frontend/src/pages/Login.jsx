import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../api/backend';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.loginUser({ email: email.trim(), password });
      if (res?.success && res?.token) {
        localStorage.setItem('token', res.token);
        navigate('/', { replace: true });
      } else {
        setError('We couldn\'t sign you in. Please check your email and password and try again.');
      }
    } catch (err) {
      setError(err.message || 'We couldn\'t complete this step. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <button
          type="button"
          className={styles.close}
          onClick={() => navigate('/')}
          aria-label="Close and go back"
        >
          ×
        </button>
        <h2 className={styles.cardTitle}>Sign in</h2>
        <p className={styles.cardSubtitle}>
          Sign in to save your information and access your care history.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            disabled={loading}
            autoComplete="email"
            autoFocus
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={loading}
            autoComplete="current-password"
          />

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className={styles.submit}>
            {loading ? 'Signing in...' : 'Continue'}
          </button>

          <p className={styles.footer}>
            Don&apos;t have an account? <Link to="/register">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
