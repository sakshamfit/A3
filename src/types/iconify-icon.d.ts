import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from 'react'

/**
 * `<iconify-icon>` is a web component registered by the `iconify-icon` package
 * (imported in `src/main.tsx`). React passes attributes straight through to
 * custom elements, so the Iconify convention is an explicit `class` attribute.
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        icon?: string
        width?: string | number
        height?: string | number
        flip?: string
        rotate?: string | number
        inline?: boolean
        mode?: 'svg' | 'bg' | 'mask'
        'noobserver'?: boolean | string
        class?: string
        style?: CSSProperties
      }
    }
  }
}

export {}
