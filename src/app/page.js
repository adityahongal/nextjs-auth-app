// src/app/page.js
"use client";

import dynamic from 'next/dynamic';
import { Container, CircularProgress, Typography } from "@mui/material";

// Dynamically import the auth component with no SSR
const AuthComponent = dynamic(() => import('./AuthComponent'), {
  ssr: false,
  loading: () => (
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
      <CircularProgress size={50} />
      <Typography variant="h6" sx={{ mt: 3 }}>
        Loading authentication...
      </Typography>
    </Container>
  )
});

export default function Home() {
  return <AuthComponent />;
}