/**
 * @fileoverview Root layout component for the Next.js application
 * 
 * Defines the HTML structure, metadata, and global fonts for all pages.
 * Sets up the Geist font family and provides the base layout wrapper.
 * 
 * This is the root component that wraps all pages in the application.
 */

import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

/**
 * Playfair Display font configuration
 * 
 * Serif font for headings and luxury typography.
 * Exported as CSS variable for use throughout the app.
 */
const playfair = Playfair_Display({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-playfair',
  display: 'swap',
});

/**
 * Inter font configuration
 * 
 * Sans-serif font for body text and UI elements.
 * Exported as CSS variable for use throughout the app.
 */
const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * Page metadata for SEO and browser display
 * 
 * Defines the default title, description, and favicon for all pages.
 * Individual pages can override these values.
 */
export const metadata: Metadata = {
  title: "Leonard Home Decor - Роскошный Домашний Декор",
  description: "Каталог товаров в наличии в Москве. Роскошный домашний декор и изысканная посуда от ведущих брендов: Lalique, Baccarat, Christofle, Ralph Lauren.",
  icons: {
    icon: '/favicon.ico',
  },
};

/**
 * Root layout component
 * 
 * Wraps all pages in the application with:
 * - HTML structure with Russian language attribute
 * - Font variables for global use
 * - Antialiased text rendering
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components (page content)
 * @returns {JSX.Element} Root HTML structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
