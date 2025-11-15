import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <React.StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
         <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <App />
         </ClerkProvider>
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  </StrictMode>
);
