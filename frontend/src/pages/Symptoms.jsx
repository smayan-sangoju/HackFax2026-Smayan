import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/backend';
import styles from './Symptoms.module.css';

function getGeolocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
}

export default function Symptoms() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = symptoms.trim();
    if (!trimmed) {
      setError('Please describe how you are feeling. Type your symptoms in the box above.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const diagnosisRaw = await api.diagnose({ symptoms: trimmed });
      const diagnosis =
        diagnosisRaw?.condition != null
          ? diagnosisRaw
          : { condition: 'Unknown', severity: 0, reasoning: 'Diagnosis pending.' };

      const { latitude, longitude } = await getGeolocation();
      const hospitalsRaw = await api.getHospitals({ latitude, longitude });
      const hospitals = Array.isArray(hospitalsRaw)
        ? hospitalsRaw
        : Array.isArray(hospitalsRaw?.data)
          ? hospitalsRaw.data
          : Array.isArray(hospitalsRaw?.hospitals)
            ? hospitalsRaw.hospitals
            : [];

      const hospitalNames = hospitals.map((h) => h.name).filter(Boolean);
      const waitTimesRaw =
        hospitalNames.length > 0
          ? await api.getWaitTimes({ hospitals: hospitalNames })
          : [];
      const waitTimes = Array.isArray(waitTimesRaw)
        ? waitTimesRaw
        : Array.isArray(waitTimesRaw?.data)
          ? waitTimesRaw.data
          : [];

      const rankRaw = await api.rank({
        hospitals,
        waitTimes,
        diagnosis,
      });
      const rankResult =
        rankRaw?.top3 != null
          ? rankRaw
          : { top3: Array.isArray(rankRaw?.data) ? rankRaw.data : [] };

      navigate('/diagnosis', {
        state: {
          diagnosis,
          hospitals,
          waitTimes,
          rankResult,
          latitude,
          longitude,
        },
      });
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'We couldn\'t connect. Please check your internet and try again.'
          : err.message || 'We couldn\'t complete this step. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Describe your symptoms.
          <br />
          <span className={styles.heroHighlight}>Find care quickly.</span>
        </h1>
        <p className={styles.heroSubtitle}>
          We&apos;ll help you find nearby hospitals based on your symptoms and location.
        </p>
      </header>

      <div className={styles.formAndFeatures}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="symptoms">How are you feeling?</label>
        <p className={styles.helper}>Example: &quot;I have chest pain and shortness of breath when I walk.&quot;</p>
        <textarea
          id="symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Type your symptoms here. For example: headache, dizziness, pain in my arm..."
          rows={6}
          disabled={loading}
          autoFocus
          aria-describedby={error ? 'symptoms-error' : undefined}
        />

        {error && (
          <p id="symptoms-error" className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className={styles.submit}>
          {loading ? 'Finding care options...' : 'Find care'}
        </button>
      </form>

      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <h3 className={styles.featureTitle}>Quick triage</h3>
          <p className={styles.featureDesc}>Get a preliminary assessment in seconds.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h3 className={styles.featureTitle}>Nearby care</h3>
          <p className={styles.featureDesc}>We find hospitals close to you.</p>
        </div>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className={styles.featureTitle}>Clear results</h3>
          <p className={styles.featureDesc}>Ranked by total time: drive + wait.</p>
        </div>
      </section>
      </div>
    </div>
  );
}
