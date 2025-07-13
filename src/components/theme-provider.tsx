"use client";

import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * Wraps your app in next-themes' ThemeProvider.
 * Use this in your RootLayout to enable theme switching on the client.
 */
export default function ThemeProvider({ // ✅ FIX: Added "default"
  children,
  ...props
}: ThemeProviderProps & { children: ReactNode }) {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}
