'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '../../styles/Success.module.css';

export default function RedirectPage() {
  const searchParams = useSearchParams();
  // Use the same URL format as the example site, but default to eldrive://home if no URL is provided
  const redirectUrl = searchParams.get('url') || 'eldrive://home';

  useEffect(() => {
    // Try to redirect to the app
    window.location.href = redirectUrl;
    
    // Fallback timer - if redirect doesn't work in 2 seconds, show message
    const timer = setTimeout(() => {
      const fallbackElement = document.getElementById('fallback-message');
      if (fallbackElement) {
        fallbackElement.style.display = 'block';
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [redirectUrl]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <div className={styles.loadingSpinner}></div>
        </div>
        <h1 className={styles.title}>Returning to App...</h1>
        <p className={styles.message}>
          You are being redirected back to the Eldrive mobile application.
        </p>
        <div id="fallback-message" style={{ display: 'none' }}>
          <p className={styles.emailNote}>
            If the app doesn't open automatically, please manually return to the Eldrive app.
          </p>
        </div>
      </div>
    </div>
  );
}
