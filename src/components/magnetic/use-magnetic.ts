import { useEffect, useRef } from 'react'

export interface UseMagneticOptions {
  /** Porcentaje del desplazamiento del cursor que se aplica al elemento. */
  strength?: number
  /** Desplazamiento máximo en píxeles. */
  maxOffset?: number
  /** Desactiva el efecto sin cambiar la estructura del componente. */
  disabled?: boolean
}

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Aplica un desplazamiento magnético suave siguiendo al cursor.
 * El movimiento se escribe en las variables `--magnetic-x` / `--magnetic-y`
 * para que el navegador solo recomponga sin re-renderizar React.
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 0.25,
  maxOffset = 6,
  disabled = false,
}: UseMagneticOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current

    if (!element || disabled) {
      return
    }

    if (typeof window.matchMedia !== 'function') {
      return
    }

    const finePointer = window.matchMedia(FINE_POINTER_QUERY)
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY)
    let frame = 0

    function reset() {
      cancelAnimationFrame(frame)
      element?.style.setProperty('--magnetic-x', '0px')
      element?.style.setProperty('--magnetic-y', '0px')
    }

    function handlePointerMove(event: PointerEvent) {
      if (!finePointer.matches || reducedMotion.matches) {
        return
      }

      cancelAnimationFrame(frame)

      frame = requestAnimationFrame(() => {
        if (!element) {
          return
        }

        const rect = element.getBoundingClientRect()
        const offsetX = event.clientX - rect.left - rect.width / 2
        const offsetY = event.clientY - rect.top - rect.height / 2
        const x = Math.max(-maxOffset, Math.min(maxOffset, offsetX * strength))
        const y = Math.max(-maxOffset, Math.min(maxOffset, offsetY * strength))

        element.style.setProperty('--magnetic-x', `${x.toFixed(2)}px`)
        element.style.setProperty('--magnetic-y', `${y.toFixed(2)}px`)
      })
    }

    element.addEventListener('pointerenter', handlePointerMove)
    element.addEventListener('pointermove', handlePointerMove)
    element.addEventListener('pointerleave', reset)
    element.addEventListener('pointercancel', reset)
    element.addEventListener('blur', reset)

    return () => {
      cancelAnimationFrame(frame)
      element.removeEventListener('pointerenter', handlePointerMove)
      element.removeEventListener('pointermove', handlePointerMove)
      element.removeEventListener('pointerleave', reset)
      element.removeEventListener('pointercancel', reset)
      element.removeEventListener('blur', reset)
      element.style.removeProperty('--magnetic-x')
      element.style.removeProperty('--magnetic-y')
    }
  }, [disabled, maxOffset, strength])

  return ref
}
