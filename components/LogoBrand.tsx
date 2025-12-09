'use client'

import { useEffect, useState } from 'react'

interface LogoBrandProps {
  src: string
  alt: string
  largeHeight?: number // rem units
  smallHeight?: number // rem units
}

export function LogoBrand({
  src,
  alt,
  largeHeight = 5, // ~h-20
  smallHeight = 3, // ~h-12
}: LogoBrandProps) {
  const [shrunk, setShrunk] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShrunk(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const heightRem = shrunk ? smallHeight : largeHeight

  return (
    <img
      src={src}
      alt={alt}
      style={{ height: `${heightRem}rem` }}
      className="w-auto transition-all duration-300 ease-in-out"
    />
  )
}

