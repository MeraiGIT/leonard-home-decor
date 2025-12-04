/**
 * @fileoverview About page component
 * 
 * Displays company information including:
 * - Company description and mission
 * - Featured brands showcase
 * - Why choose us section with key benefits
 * - Call-to-action buttons for products and contact
 * - Footer with company information
 * 
 * Uses the same luxury design language as the homepage with maroon and gold
 * color scheme, elegant typography, and sophisticated layout.
 */

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import Header from '@/app/components/Header'

/**
 * About page component
 * 
 * Provides information about Leonard Home Decor including:
 * - Company description and value proposition
 * - Complete list of featured brands
 * - Four key benefits (authenticity, pricing, assortment, custom orders)
 * - Navigation to product catalog and contact options
 * 
 * @returns {JSX.Element} Complete about page with hero, content sections, and footer
 */
export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Maroon/Burgundy Background */}
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
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
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
              className="text-5xl sm:text-6xl lg:text-7xl font-light font-serif text-[#D4AF37] mb-6 tracking-wider uppercase letter-spacing-wider"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              О нас
            </motion.h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mt-8" />
          </motion.div>
        </motion.div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="space-y-20">
          {/* Company Description */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
            
            <p className="text-xl sm:text-2xl text-gray-800 font-light leading-relaxed text-center max-w-4xl mx-auto">
              Leonard HomeDecor предлагает оригинальные товары от ведущих брендов декора по близ-европейским ценам. 
              Наш ассортимент постоянно обновляется, и мы всегда можем привезти желаемый товар напрямую от производителя.
            </p>
            
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
          </motion.div>

          {/* Brands Section */}
          <div className="pt-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl sm:text-5xl font-light font-serif text-black mb-4 tracking-wide uppercase">
                Наши Бренды
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
            </motion.div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
              {['Lalique', 'Baccarat', 'Christofle', 'Ralph Lauren', 'DAUM', 'ROBBE & BERKING', 'VIDO', 'LLADRO', 'DERNARDAUD', 'HAVILAND', 'MEISSEN', 'ROSENTHAL'].map((brand, index) => (
                <motion.div
                  key={brand}
                  className="brand-card text-center py-6 sm:py-10 px-4 border-2 transition-all duration-300 group relative overflow-hidden flex items-center justify-center min-h-[80px] sm:min-h-[120px]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <h3 className="text-sm sm:text-lg font-light text-black tracking-wide uppercase relative z-10 group-hover:text-[#722F37] transition-colors duration-300 leading-tight px-1">
                    {brand}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="pt-16 border-t-2" style={{ borderColor: '#D4AF37' }}>
            <div className="space-y-12 max-w-3xl mx-auto">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-3xl sm:text-4xl font-light font-serif text-black mb-4 tracking-wide uppercase">
                  Почему мы
                </h3>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[
                  { title: 'Оригинальность', description: 'Все товары являются оригиналами от официальных производителей с полной гарантией подлинности.' },
                  { title: 'Доступные цены', description: 'Мы предлагаем конкурентоспособные цены, близкие к европейским, делая роскошь более доступной.' },
                  { title: 'Актуальный ассортимент', description: 'Каталог регулярно пополняется новыми коллекциями и эксклюзивными изделиями.' },
                  { title: 'Индивидуальный заказ', description: 'Можем организовать доставку желаемого товара напрямую от производителя.' }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="space-y-4 p-6 border-l-2"
                    style={{ borderColor: '#D4AF37' }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h4 className="text-xl font-light text-black uppercase tracking-wide flex items-center gap-3">
                      <span className="text-2xl" style={{ color: '#D4AF37' }}>◆</span>
                      {item.title}
                    </h4>
                    <p className="text-gray-700 font-light leading-relaxed pl-8">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            className="pt-20 text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-4" />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                asChild
                className="rounded-none px-14 py-5 bg-[#722F37] text-white font-light tracking-wider uppercase text-sm hover:bg-[#5a252a] shadow-lg"
              >
                <Link href="/#collection">
                  Товары В Наличии
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="rounded-none px-14 py-5 border-2 border-[#722F37] text-[#722F37] font-light tracking-wider uppercase text-sm hover:bg-[#722F37] hover:text-white"
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
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </motion.div>
        </div>
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
                  <Link href="/#collection" className="text-sm text-gray-300 hover:text-[#D4AF37] font-light transition-colors duration-300 uppercase tracking-wide">
                    Коллекция
                  </Link>
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

