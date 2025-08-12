"use client"

import { useEffect, useRef, useState } from "react"

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

interface SwipeOptions {
  threshold?: number
  preventDefaultTouchmoveEvent?: boolean
}

export function useSwipe(handlers: SwipeHandlers, options: SwipeOptions = {}) {
  const { threshold = 50, preventDefaultTouchmoveEvent = false } = options
  const elementRef = useRef<HTMLElement>(null)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

  const minSwipeDistance = threshold

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchMove = (e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault()
    }
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isLeftSwipe = distanceX > minSwipeDistance
    const isRightSwipe = distanceX < -minSwipeDistance
    const isUpSwipe = distanceY > minSwipeDistance
    const isDownSwipe = distanceY < -minSwipeDistance

    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      // Horizontal swipe
      if (isLeftSwipe && handlers.onSwipeLeft) {
        handlers.onSwipeLeft()
      }
      if (isRightSwipe && handlers.onSwipeRight) {
        handlers.onSwipeRight()
      }
    } else {
      // Vertical swipe
      if (isUpSwipe && handlers.onSwipeUp) {
        handlers.onSwipeUp()
      }
      if (isDownSwipe && handlers.onSwipeDown) {
        handlers.onSwipeDown()
      }
    }
  }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener("touchstart", onTouchStart, { passive: true })
    element.addEventListener("touchmove", onTouchMove, { passive: !preventDefaultTouchmoveEvent })
    element.addEventListener("touchend", onTouchEnd, { passive: true })

    return () => {
      element.removeEventListener("touchstart", onTouchStart)
      element.removeEventListener("touchmove", onTouchMove)
      element.removeEventListener("touchend", onTouchEnd)
    }
  }, [touchStart, touchEnd, handlers, preventDefaultTouchmoveEvent])

  return elementRef
}
