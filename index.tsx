
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Correctly imports App using a relative path.
import './hooks/useDarkMode'; // Initialize dark mode listener
import i18n from './i18n/config'; // Import i18n configuration
import { I18nextProvider } from 'react-i18next';

// If you are seeing an error like "The requested module '@/App' does not provide an export named 'default'":
// 1. Clear your browser cache thoroughly (hard refresh: Ctrl+Shift+R or Cmd+Shift+R).
//    This is the most common cause, as an old file with an incorrect import path like 'import ... from "@/App";' might be cached.
// 2. The path '@/' is an alias typically configured in build tools (like Vite/Webpack). Browsers don't understand it natively.
//    Ensure your build tool (if used) is configured correctly, or that all local imports use relative (./, ../) or absolute (/) paths.
// 3. The current code uses './App', which is correct for a direct ESM setup or standard build tool configurations.
//    The problematic import '@App' is NOT present in this file or the other provided files.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </React.Suspense>
  </React.StrictMode>
);