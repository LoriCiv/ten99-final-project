"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types"; // Corrected this line

/**
 * This component provides theme management (e.g., light/dark mode) for your application.
 * It uses the `next-themes` library, which is the standard for Next.js apps.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
