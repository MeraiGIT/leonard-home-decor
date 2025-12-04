/**
 * @fileoverview Main homepage component
 * 
 * Displays the luxury home decor e-commerce homepage featuring:
 * - Hero section with brand introduction
 * - Product catalog with filtering capabilities
 * - Brand and price filters
 * - Product grid with hover image effects
 * - Footer with company information
 * 
 * Products are fetched from Supabase and filtered client-side based on
 * user selections. Only products with stock > 0 are displayed.
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from '@/lib/supabase'
import Header from '@/app/components/Header'
import LuxuryProductCard from '@/app/components/LuxuryProductCard'

/**
 * Product data structure from Supabase
 */
interface Product {
  id: string
  name: string
  brand: string | null
  price: number | null
  stock: number
  image_url_1: string | null
  image_url_2: string | null
}

/**
 * Home page component
 * 
 * Main landing page that displays:
 * - Hero section with company branding
 * - Product collection with filters
 * - Footer with contact information
 * 
 * Features:
 * - Real-time product filtering by brand and price
 * - Responsive grid layout
 * - Image hover effects showing alternate product views
 * 
 * @returns {JSX.Element} Complete homepage with hero, products, and footer
 */
export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState<string>('all')
  const [selectedPrice, setSelectedPrice] = useState<string>('all')
  const [brands, setBrands] = useState<string[]>([])

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .gt('stock', 0)
          .order('name')

        if (error) {
          console.error('Error fetching products:', error)
          return
        }

        if (data) {
          setProducts(data as Product[])
          setFilteredProducts(data as Product[])
          
          // Extract unique brands
          const uniqueBrands = Array.from(
            new Set(data.filter(p => p.brand).map(p => p.brand as string))
          ).sort()
          setBrands(uniqueBrands)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  /**
   * Filters products based on selected brand and price criteria
   * 
   * Runs whenever selectedBrand, selectedPrice, or products change.
   * Applies filters sequentially:
   * 1. Brand filter (if not 'all')
   * 2. Price range filter (if not 'all')
   * 
   * Price ranges:
   * - 'under-50000': Products under 50,000 ₽
   * - '50000-150000': Products between 50,000 and 150,000 ₽
   * - 'over-150000': Products over 150,000 ₽
   */
  useEffect(() => {
    let filtered = [...products]

    // Filter by brand
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p => p.brand === selectedBrand)
    }

    // Filter by price
    if (selectedPrice !== 'all') {
      filtered = filtered.filter(p => {
        if (!p.price) return false
        const price = p.price
        switch (selectedPrice) {
          case 'under-50000':
            return price < 50000
          case '50000-150000':
            return price >= 50000 && price <= 150000
          case 'over-150000':
            return price > 150000
          default:
            return true
        }
      })
    }

    setFilteredProducts(filtered)
  }, [selectedBrand, selectedPrice, products])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Maroon/Burgundy Background with subtle textures */}
        <div className="absolute inset-0" style={{ backgroundColor: '#722F37' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#5a252a]/80 via-transparent to-transparent" />
          {/* Golden accent overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#D4AF37]/30 via-transparent to-transparent" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#D4AF37]/20 via-transparent to-transparent" />
          </div>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Content */}
        <motion.div 
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mb-8" />
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#D4AF37] mb-6 tracking-wider uppercase letter-spacing-wider"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              LEONARD
            </motion.h1>
            <div className="w-32 h-px bg-[#D4AF37] mx-auto my-2" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-sans text-[#D4AF37] tracking-widest uppercase">
              HOME DECOR
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mt-8" />
          </motion.div>
          
          <motion.p 
            className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-[#D4AF37]/90 mb-6 font-light tracking-wide"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Роскошный Домашний Декор и Изысканная Посуда
          </motion.p>
          
          <motion.p 
            className="text-sm sm:text-base lg:text-lg xl:text-xl text-[#D4AF37]/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Каталог Товаров в наличии в Москве
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="rounded-none px-10 py-4 border border-[#D4AF37]/50 bg-[#D4AF37]/10 backdrop-blur-sm text-[#D4AF37] font-light tracking-wider uppercase text-sm hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]"
              >
                <Link href="/about">
                  О нас
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                asChild
                className="rounded-none px-10 py-4 border border-[#D4AF37]/50 bg-[#D4AF37]/10 backdrop-blur-sm text-[#D4AF37] font-light tracking-wider uppercase text-sm hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]"
              >
                <a
                  href="https://wa.me/79957844513"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Связаться с нами
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#D4AF37]/30 to-transparent" />
        </div>
      </section>

      {/* Products Section */}
      <section id="collection" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light font-serif text-black mb-4 tracking-wide uppercase">
            Наша Коллекция
          </h2>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-black/30 to-transparent mx-auto" />
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-6 mb-16 max-w-2xl mx-auto">
          {/* Brand Filter */}
          <div className="flex-1">
            <label htmlFor="brand-filter" className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-wider">
              Бренд
            </label>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger 
                id="brand-filter"
                className="w-full px-5 py-3 border border-gray-300 bg-white text-black font-light tracking-wide focus:outline-none focus:border-black transition-colors duration-300"
              >
                <SelectValue placeholder="Все Бренды" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все Бренды</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Filter */}
          <div className="flex-1">
            <label htmlFor="price-filter" className="block text-xs font-light text-gray-600 mb-3 uppercase tracking-wider">
              Цена
            </label>
            <Select value={selectedPrice} onValueChange={setSelectedPrice}>
              <SelectTrigger 
                id="price-filter"
                className="w-full px-5 py-3 border border-gray-300 bg-white text-black font-light tracking-wide focus:outline-none focus:border-black transition-colors duration-300"
              >
                <SelectValue placeholder="Все Цены" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все Цены</SelectItem>
                <SelectItem value="under-50000">До 50 000 ₽</SelectItem>
                <SelectItem value="50000-150000">50 000 - 150 000 ₽</SelectItem>
                <SelectItem value="over-150000">Свыше 150 000 ₽</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-32">
            <p className="text-gray-500 text-sm font-light tracking-wide uppercase">Загрузка товаров...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-gray-500 text-sm font-light tracking-wide uppercase">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <LuxuryProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="text-white mt-40 relative overflow-hidden" style={{ backgroundColor: '#722F37' }}>
        {/* Decorative gold overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#D4AF37]/20 via-transparent to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-20 mb-20">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-serif mb-8 uppercase tracking-wider" style={{ color: '#D4AF37' }}>
                LEONARD HOME DECOR
              </h3>
              <div className="w-16 h-px mb-6" style={{ backgroundColor: '#D4AF37' }} />
              <p className="text-sm text-gray-300 font-light leading-relaxed mb-4">
                Роскошный домашний декор и изысканная посуда премиум-класса.
              </p>
              <p className="text-sm text-gray-300 font-light">
                Каталог товаров в наличии в Москве.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-light uppercase tracking-wider mb-8" style={{ color: '#D4AF37' }}>
                Навигация
              </h3>
              <div className="w-16 h-px mb-6" style={{ backgroundColor: '#D4AF37' }} />
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-sm text-gray-300 hover:text-[#D4AF37] font-light transition-colors duration-300 uppercase tracking-wide">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-gray-300 hover:text-[#D4AF37] font-light transition-colors duration-300 uppercase tracking-wide">
                    О нас
                  </Link>
                </li>
                <li>
                  <a href="#collection" className="text-sm text-gray-300 hover:text-[#D4AF37] font-light transition-colors duration-300 uppercase tracking-wide">
                    Коллекция
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xl font-light uppercase tracking-wider mb-8" style={{ color: '#D4AF37' }}>
                Контакты
              </h3>
              <div className="w-16 h-px mb-6" style={{ backgroundColor: '#D4AF37' }} />
              <ul className="space-y-4 text-sm text-gray-300 font-light">
                <li className="uppercase tracking-wide">Москва, Россия</li>
                <li>
                  <a href="mailto:info@leonardhomedecor.com" className="hover:text-[#D4AF37] transition-colors duration-300">
                    info@leonardhomedecor.com
                  </a>
                </li>
                <li>
                  <a 
                    href="https://wa.me/79957844513" 
            target="_blank"
            rel="noopener noreferrer"
                    className="hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    +7 (995) 784-45-13
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t pt-10" style={{ borderColor: '#D4AF37' }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-400 font-light">
                © {new Date().getFullYear()} LEONARD HOME DECOR. Все права защищены.
              </p>
              <div className="flex gap-8">
                <a href="#" className="text-xs text-gray-400 hover:text-[#D4AF37] font-light transition-colors duration-300">
                  Политика конфиденциальности
                </a>
                <a href="#" className="text-xs text-gray-400 hover:text-[#D4AF37] font-light transition-colors duration-300">
                  Условия использования
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

