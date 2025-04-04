import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { cn } from '@/utils/cn'

export interface PortalProps {
  children: React.ReactNode
  container?: Element
}

export const Portal: React.FC<PortalProps> = ({ children, container }) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  if (!mounted) return null

  return container
    ? ReactDOM.createPortal(children, container)
    : children
}

export interface VisibilityProps {
  children: React.ReactNode
  show?: boolean
}

export const Visibility: React.FC<VisibilityProps> = ({ children, show = true }) => {
  return show ? <>{children}</> : null
}

export interface ConditionalWrapperProps {
  children: React.ReactNode
  condition: boolean
  wrapper: (children: React.ReactNode) => React.ReactNode
}

export const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
  children,
  condition,
  wrapper
}) => {
  return condition ? wrapper(children) : <>{children}</>
}

export interface ClickOutsideProps extends React.HTMLAttributes<HTMLDivElement> {
  onClickOutside: (event: MouseEvent) => void
  disabled?: boolean
}

export const ClickOutside = React.forwardRef<HTMLDivElement, ClickOutsideProps>(
  ({ onClickOutside, disabled, children, ...props }, ref) => {
    const innerRef = React.useRef<HTMLDivElement>(null)
    const combinedRef = useCombinedRefs(ref, innerRef)

    React.useEffect(() => {
      if (disabled) return

      const handleClickOutside = (event: MouseEvent) => {
        if (
          innerRef.current &&
          !innerRef.current.contains(event.target as Node)
        ) {
          onClickOutside(event)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onClickOutside, disabled])

    return (
      <div ref={combinedRef} {...props}>
        {children}
      </div>
    )
  }
)
ClickOutside.displayName = 'ClickOutside'

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback: React.ReactNode | ((error: Error) => React.ReactNode)
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      const fallback = this.props.fallback
      return typeof fallback === 'function'
        ? fallback(this.state.error!)
        : fallback
    }

    return this.props.children
  }
}

function useCombinedRefs<T>(...refs: (React.Ref<T> | null)[]) {
  return React.useCallback((element: T) => {
    refs.forEach((ref) => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(element)
      } else {
        (ref as React.MutableRefObject<T>).current = element
      }
    })
  }, [refs])
}

export interface ResizeObserverProps {
  children: React.ReactNode
  onResize?: (entry: ResizeObserverEntry) => void
  className?: string
}

export const ResizeObserver = React.forwardRef<HTMLDivElement, ResizeObserverProps>(
  ({ onResize, children, className, ...props }, ref) => {
    const innerRef = React.useRef<HTMLDivElement>(null)
    const combinedRef = useCombinedRefs(ref, innerRef)

    React.useEffect(() => {
      if (!onResize) return

      const observer = new window.ResizeObserver((entries) => {
        entries.forEach((entry) => {
          onResize(entry)
        })
      })

      if (innerRef.current) {
        observer.observe(innerRef.current)
      }

      return () => observer.disconnect()
    }, [onResize])

    return (
      <div ref={combinedRef} className={className} {...props}>
        {children}
      </div>
    )
  }
)
ResizeObserver.displayName = 'ResizeObserver' 