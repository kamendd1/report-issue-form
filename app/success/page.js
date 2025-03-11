'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from '../../styles/Success.module.css';

function SuccessContent() {
  const searchParams = useSearchParams();
  const ticketNumber = searchParams.get('ticket');

  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
          <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
      </div>
      
      <h1 className={styles.title}>Issue Reported Successfully!</h1>
      <p className={styles.message}>
        Thank you for reporting the issue. Our team will review it and get back to you soon.
      </p>
      <div className={styles.ticketInfo}>
        <p>Your ticket number: <span className={styles.ticketNumber}>#{ticketNumber || 'N/A'}</span></p>
        <p className={styles.emailNote}>A confirmation email has been sent to your email address.</p>
      </div>
      <Link href="/" className={styles.button}>
        Report Another Issue
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className={styles.container}>
      <Suspense fallback={
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <svg className={styles.checkmark} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
              <circle className={styles.checkmarkCircle} cx="26" cy="26" r="25" fill="none"/>
              <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
          <h1 className={styles.title}>Issue Reported Successfully!</h1>
          <p className={styles.message}>Loading ticket information...</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
