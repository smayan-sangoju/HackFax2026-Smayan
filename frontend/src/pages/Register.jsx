import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../api/backend';
import styles from './Register.module.css';

const GENDERS = ['Male', 'Female', 'Other'];

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    if (!form.firstName.trim()) return 'Please enter your first name.';
    if (!form.lastName.trim()) return 'Please enter your last name.';
    const age = Number(form.age);
    if (!form.age || isNaN(age) || age < 1 || age > 150) return 'Please enter your age (a number between 1 and 150).';
    if (!form.gender) return 'Please select your gender.';
    if (!form.email.trim()) return 'Please enter your email address.';
    if (!form.password) return 'Please enter a password.';
    if (form.password.length < 6) return 'Your password must be at least 6 characters long.';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);

    try {
      const res = await api.registerUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        age: Number(form.age),
        gender: form.gender,
        email: form.email.trim(),
        password: form.password,
      });
      if (res?.success) {
        navigate('/login', { replace: true });
      } else {
        setError('We couldn\'t create your account. Please try again.');
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
        <h2 className={styles.cardTitle}>Create account</h2>
        <p className={styles.cardSubtitle}>
          We use this to personalize your care recommendations. Your information is kept private.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                placeholder="John"
                disabled={loading}
                autoComplete="given-name"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                placeholder="Doe"
                disabled={loading}
                autoComplete="family-name"
              />
            </div>
          </div>

          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            min={1}
            max={150}
            value={form.age}
            onChange={(e) => update('age', e.target.value)}
            placeholder="25"
            disabled={loading}
            autoComplete="bday-year"
          />

          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            value={form.gender}
            onChange={(e) => update('gender', e.target.value)}
            disabled={loading}
          >
            <option value="">Select...</option>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="your.email@example.com"
            disabled={loading}
            autoComplete="email"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            placeholder="At least 6 characters"
            disabled={loading}
            autoComplete="new-password"
          />

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className={styles.submit}>
            {loading ? 'Creating account...' : 'Continue'}
          </button>

          <p className={styles.footer}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
