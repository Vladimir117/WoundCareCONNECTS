import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from 'src/auth/auth-provider';

// Routes
import Router from 'src/routes/sections';

// theme
// import ThemeProvider from 'src/theme';

// components
import ScrollToTop from 'src/components/scroll-to-top';

export default function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          {/* <ThemeProvider>/ */}
            <ScrollToTop />
            <Router />
          {/* </ThemeProvider> */}
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  );
}
