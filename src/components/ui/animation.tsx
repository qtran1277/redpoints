import * as React from 'react'
import { cn } from '@/utils/cn'

export interface FadeProps extends React.HTMLAttributes<HTMLDivElement> {
  in?: boolean
  duration?: number
  delay?: number
  unmountOnExit?: boolean
}

export const Fade = React.forwardRef<HTMLDivElement, FadeProps>(
  ({ className, in: inProp = false, duration = 200, delay = 0, unmountOnExit = false, children, ...props }, ref) => {
    const [mounted, setMounted] = React.useState<boolean>(false)
    const [visible, setVisible] = React.useState<boolean>(false)
    const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

    React.useEffect(() => {
      if (inProp) {
        setMounted(true)
        timeoutRef.current = setTimeout(() => {
          setVisible(true)
        }, 10)
      } else {
        setVisible(false)
        if (unmountOnExit) {
          timeoutRef.current = setTimeout(() => {
            setMounted(false)
          }, duration)
        }
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [inProp, duration, unmountOnExit])

    if (!mounted) return null

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          opacity: visible ? 1 : 0,
          transition: `opacity ${duration}ms ease-in-out`,
          transitionDelay: `${delay}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Fade.displayName = 'Fade'

export interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  in?: boolean
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: string
  duration?: number
  delay?: number
  unmountOnExit?: boolean
}

export const Slide = React.forwardRef<HTMLDivElement, SlideProps>(
  ({
    className,
    in: inProp = false,
    direction = 'down',
    distance = '20px',
    duration = 200,
    delay = 0,
    unmountOnExit = false,
    children,
    ...props
  }, ref) => {
    const [mounted, setMounted] = React.useState<boolean>(false)
    const [visible, setVisible] = React.useState<boolean>(false)
    const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

    const getTransform = (visible: boolean) => {
      if (!visible) {
        switch (direction) {
          case 'up':
            return `translateY(${distance})`
          case 'down':
            return `translateY(-${distance})`
          case 'left':
            return `translateX(${distance})`
          case 'right':
            return `translateX(-${distance})`
        }
      }
      return 'translate(0)'
    }

    React.useEffect(() => {
      if (inProp) {
        setMounted(true)
        timeoutRef.current = setTimeout(() => {
          setVisible(true)
        }, 10)
      } else {
        setVisible(false)
        if (unmountOnExit) {
          timeoutRef.current = setTimeout(() => {
            setMounted(false)
          }, duration)
        }
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [inProp, duration, unmountOnExit])

    if (!mounted) return null

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          opacity: visible ? 1 : 0,
          transform: getTransform(visible),
          transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`,
          transitionDelay: `${delay}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Slide.displayName = 'Slide'

export interface ScaleProps extends React.HTMLAttributes<HTMLDivElement> {
  in?: boolean
  duration?: number
  delay?: number
  unmountOnExit?: boolean
}

export const Scale = React.forwardRef<HTMLDivElement, ScaleProps>(
  ({ className, in: inProp = false, duration = 200, delay = 0, unmountOnExit = false, children, ...props }, ref) => {
    const [mounted, setMounted] = React.useState<boolean>(false)
    const [visible, setVisible] = React.useState<boolean>(false)
    const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

    React.useEffect(() => {
      if (inProp) {
        setMounted(true)
        timeoutRef.current = setTimeout(() => {
          setVisible(true)
        }, 10)
      } else {
        setVisible(false)
        if (unmountOnExit) {
          timeoutRef.current = setTimeout(() => {
            setMounted(false)
          }, duration)
        }
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [inProp, duration, unmountOnExit])

    if (!mounted) return null

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.95)',
          transition: `opacity ${duration}ms ease-in-out, transform ${duration}ms ease-in-out`,
          transitionDelay: `${delay}ms`,
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Scale.displayName = 'Scale'

export interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  in?: boolean
  duration?: number
  delay?: number
  unmountOnExit?: boolean
}

export const Collapse = React.forwardRef<HTMLDivElement, CollapseProps>(
  ({ className, in: inProp = false, duration = 200, delay = 0, unmountOnExit = false, children, ...props }, ref) => {
    const [mounted, setMounted] = React.useState<boolean>(false)
    const [visible, setVisible] = React.useState<boolean>(false)
    const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)
    const contentRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      if (inProp) {
        setMounted(true)
        timeoutRef.current = setTimeout(() => {
          setVisible(true)
        }, 10)
      } else {
        setVisible(false)
        if (unmountOnExit) {
          timeoutRef.current = setTimeout(() => {
            setMounted(false)
          }, duration)
        }
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [inProp, duration, unmountOnExit])

    if (!mounted) return null

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          height: visible ? contentRef.current?.scrollHeight : 0,
          opacity: visible ? 1 : 0,
          overflow: 'hidden',
          transition: `height ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
          transitionDelay: `${delay}ms`,
        }}
        {...props}
      >
        <div ref={contentRef}>{children}</div>
      </div>
    )
  }
)
Collapse.displayName = 'Collapse' 