'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

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

interface LuxuryProductCardProps {
  product: Product
}

/**
 * Luxury Product Card Component
 * 
 * Displays a single product with luxury styling and Framer Motion animations:
 * - Card lifts and scales on hover
 * - Image zooms and swaps on hover
 * - Elegant typography with serif fonts
 * - Price with decorative line above
 * 
 * @param {LuxuryProductCardProps} props - Component props
 * @param {Product} props.product - Product data object
 * 
 * @returns {JSX.Element} Luxury product card with animations
 */
export default function LuxuryProductCard({ product }: LuxuryProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const imageUrl = hovered && product.image_url_2 ? product.image_url_2 : product.image_url_1

  // Format price: "27 000₽" (no space before ₽)
  const formattedPrice = product.price !== null
    ? `${product.price.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}₽`
    : null

  return (
    <motion.div
      className="group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      style={{ transition: 'box-shadow 0.4s ease' }}
    >
      {/* Image Container */}
      <motion.div 
        className="relative w-full aspect-square bg-neutral-100 mb-5 overflow-hidden"
        style={{ boxShadow: hovered ? '0 20px 40px rgba(0, 0, 0, 0.1)' : 'none' }}
      >
        {imageUrl ? (
          <motion.div
            className="relative w-full h-full"
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          </motion.div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-gray-400 text-xs font-light uppercase tracking-wide">
            Нет изображения
          </div>
        )}
      </motion.div>

      {/* Product Info */}
      <div>
        {product.brand && (
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-widest font-light">
            {product.brand}
          </p>
        )}
        <h3 className="text-base font-serif text-gray-900 mb-2 line-clamp-2 min-h-[3rem] leading-relaxed">
          {product.name}
        </h3>
        {formattedPrice && (
          <div className="flex flex-col items-start">
            <div className="w-12 h-px bg-gray-300 mb-1.5" />
            <p className="text-xl font-serif font-light text-gray-900">
              {formattedPrice}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

