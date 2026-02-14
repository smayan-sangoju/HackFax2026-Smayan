import { Outlet, Link } from 'react-router-dom';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandText}>Triage</span><span className={styles.brandHighlight}>Sense</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/login" className={styles.signIn}>Sign in</Link>
          <Link to="/register" className={styles.createAccount}>Create account</Link>
        </nav>
      </header>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}
