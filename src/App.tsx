import React, { useEffect } from "react";
import { AppRouter } from "./components/AppRouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { URLDebugger, useURLDebugger } from "./components/URLDebugger";

export default function App() {
  const { showDebugger } = useURLDebugger();

  // Initialize URL routing on app start
  useEffect(() => {
    const currentPath = window.location.pathname;

    // Only redirect if we're on actual root, not system pages
    if (currentPath === '/' || currentPath === '') {
      window.history.replaceState(null, '', '/orders');
    }
    // Don't redirect system/preview pages - let URL router handle them
  }, []);

  return (
    <ErrorBoundary>
      <AppRouter />
      <URLDebugger show={showDebugger} />
    </ErrorBoundary>
  );
}