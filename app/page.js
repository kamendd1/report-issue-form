'use client';

import { Container } from '@mui/material';
import ReportIssueForm from '../components/ReportIssueForm';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ReportIssueForm />
    </Container>
  );
}
