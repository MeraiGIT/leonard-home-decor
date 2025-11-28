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

import Link from 'next/link'
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
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto animate-fade-in">
          <div className="mb-8 animate-slide-up">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mb-8" />
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-[#D4AF37] mb-6 tracking-wider uppercase letter-spacing-wider">
              О нас
            </h1>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mt-8" />
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="space-y-20">
          {/* Company Description */}
          <div className="space-y-8">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
            
            <p className="text-xl sm:text-2xl text-gray-800 font-light leading-relaxed text-center max-w-4xl mx-auto">
              Leonard HomeDecor предлагает оригинальные товары от ведущих брендов декора по близ-европейским ценам. 
              Наш ассортимент постоянно обновляется, и мы всегда можем привезти желаемый товар напрямую от производителя.
            </p>
            
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
          </div>

          {/* Brands Section */}
          <div className="pt-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-light text-black mb-4 tracking-wide uppercase">
                Наши Бренды
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
              {['Lalique', 'Baccarat', 'Christofle', 'Ralph Lauren', 'DAUM', 'ROBBE & BERKING', 'VIDO', 'LLADRO', 'DERNARDAUD', 'HAVILAND', 'MEISSEN'].map((brand) => (
                <div
                  key={brand}
                  className="brand-card text-center py-10 px-4 border-2 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <h3 className="text-lg font-light text-black tracking-wide uppercase relative z-10 group-hover:text-[#722F37] transition-colors duration-300">
                    {brand}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="pt-16 border-t-2" style={{ borderColor: '#D4AF37' }}>
            <div className="space-y-12 max-w-3xl mx-auto">
              <div className="text-center">
                <h3 className="text-3xl sm:text-4xl font-light text-black mb-4 tracking-wide uppercase">
                  Почему мы
                </h3>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4 p-6 border-l-2" style={{ borderColor: '#D4AF37' }}>
                  <h4 className="text-xl font-light text-black uppercase tracking-wide flex items-center gap-3">
                    <span className="text-2xl" style={{ color: '#D4AF37' }}>◆</span>
                    Оригинальность
                  </h4>
                  <p className="text-gray-700 font-light leading-relaxed pl-8">
                    Все товары являются оригиналами от официальных производителей с полной гарантией подлинности.
                  </p>
                </div>
                
                <div className="space-y-4 p-6 border-l-2" style={{ borderColor: '#D4AF37' }}>
                  <h4 className="text-xl font-light text-black uppercase tracking-wide flex items-center gap-3">
                    <span className="text-2xl" style={{ color: '#D4AF37' }}>◆</span>
                    Доступные цены
                  </h4>
                  <p className="text-gray-700 font-light leading-relaxed pl-8">
                    Мы предлагаем конкурентоспособные цены, близкие к европейским, делая роскошь более доступной.
                  </p>
                </div>
                
                <div className="space-y-4 p-6 border-l-2" style={{ borderColor: '#D4AF37' }}>
                  <h4 className="text-xl font-light text-black uppercase tracking-wide flex items-center gap-3">
                    <span className="text-2xl" style={{ color: '#D4AF37' }}>◆</span>
                    Актуальный ассортимент
                  </h4>
                  <p className="text-gray-700 font-light leading-relaxed pl-8">
                    Каталог регулярно пополняется новыми коллекциями и эксклюзивными изделиями.
                  </p>
                </div>
                
                <div className="space-y-4 p-6 border-l-2" style={{ borderColor: '#D4AF37' }}>
                  <h4 className="text-xl font-light text-black uppercase tracking-wide flex items-center gap-3">
                    <span className="text-2xl" style={{ color: '#D4AF37' }}>◆</span>
                    Индивидуальный заказ
                  </h4>
                  <p className="text-gray-700 font-light leading-relaxed pl-8">
                    Можем организовать доставку желаемого товара напрямую от производителя.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-20 text-center space-y-6">
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-4" />
            <Link
              href="/#collection"
              className="cta-button-primary inline-block px-14 py-5 text-white font-light tracking-wider uppercase text-sm transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
            >
              Товары В Наличии
            </Link>
            <div>
              <a
                href="https://wa.me/79957844513"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button-secondary inline-block px-14 py-5 border-2 font-light tracking-wider uppercase text-sm transition-all duration-300 transform hover:scale-[1.02]"
              >
                Связаться с нами
              </a>
            </div>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4" />
          </div>
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

