// src/components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

/**
 * This component provides theme management (e.g., light/dark mode) for your application.
 * It uses the `next-themes` library, which is the standard for Next.js apps.
 * It handles theme switching, system theme detection, and persists the user's choice.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### **Important Next Step**

Just creating this file isn't enough. You need to use it in your main layout to wrap your entire application.

1.  **Open your root layout file:** `src/app/layout.tsx`
2.  **Import** the `ThemeProvider` you just created.
3.  **Wrap** the contents of your `<body>` tag with it.

Here is how your `src/app/layout.tsx` should look after the change:

```tsx
// src/app/layout.tsx

import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from "@/components/theme-provider" // <-- Import it
import './globals.css'

export const metadata = {
  title: 'Ten99',
  description: 'Your Freelancing, Simplified.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
```
