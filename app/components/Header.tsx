/**
 * @fileoverview Header navigation component
 * 
 * Provides the main site navigation with logo, menu links, and contact button.
 * Features a fixed header that stays at the top during scroll, with responsive
 * design for mobile and desktop views.
 * 
 * The logo automatically falls back to a text-based version if the image file
 * is not found, maintaining brand consistency.
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

/**
 * Header component with navigation and logo
 * 
 * Displays:
 * - Company logo (with fallback to text logo)
 * - Navigation links (Home, About, Collection)
 * - WhatsApp contact button
 * - Mobile menu button (for responsive design)
 * 
 * @returns {JSX.Element} Fixed header navigation bar
 */
export default function Header() {
  const [logoExists, setLogoExists] = useState(false)

  useEffect(() => {
    // Check if logo file exists
    const img = new window.Image()
    img.onload = () => setLogoExists(true)
    img.onerror = () => setLogoExists(false)
    img.src = '/logo.png'
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-48 h-16 flex items-center">
              {logoExists ? (
                <Image
                  src="/logo.png"
                  alt="Leonard Home Decor"
                  width={192}
                  height={64}
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="flex flex-col items-start justify-center h-full">
                  <span className="text-3xl font-serif leading-tight" style={{ color: '#722F37' }}>LEONARD</span>
                  <div className="w-full h-px my-1" style={{ backgroundColor: '#722F37' }}></div>
                  <span className="text-sm font-sans uppercase tracking-wider" style={{ color: '#722F37' }}>HOME DECOR</span>
                </div>
              )}
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="nav-link text-sm font-light transition-colors duration-300 uppercase tracking-wide"
            >
              Главная
            </Link>
            <Link
              href="/about"
              className="nav-link text-sm font-light transition-colors duration-300 uppercase tracking-wide"
            >
              О нас
            </Link>
            <Link
              href="/#collection"
              className="nav-link text-sm font-light transition-colors duration-300 uppercase tracking-wide"
            >
              Коллекция
            </Link>
            <a
              href="https://wa.me/79957844513"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-button text-sm font-light px-4 py-2 transition-all duration-300 uppercase tracking-wide"
            >
              Связаться
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" style={{ color: '#722F37' }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
