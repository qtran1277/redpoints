import * as React from 'react'
import { cn } from '@/utils/cn'

export interface TransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  show?: boolean
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
  beforeEnter?: () => void
  afterEnter?: () => void
  beforeLeave?: () => void
  afterLeave?: () => void
}

export const Transition = React.forwardRef<HTMLDivElement, TransitionProps>(
  ({
    className,
    show = true,
    enter = '',
    enterFrom = '',
    enterTo = '',
    leave = '',
    leaveFrom = '',
    leaveTo = '',
    beforeEnter,
    afterEnter,
    beforeLeave,
    afterLeave,
    children,
    ...props
  }, ref) => {
    const [mounted, setMounted] = React.useState(false)
    const [stage, setStage] = React.useState<'enter' | 'leave' | null>(null)
    const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

    React.useEffect(() => {
      if (show && !mounted) {
        setMounted(true)
        beforeEnter?.()
        setStage('enter')
        timeoutRef.current = setTimeout(() => {
          afterEnter?.()
          setStage(null)
        }, 150)
      } else if (!show && mounted) {
        beforeLeave?.()
        setStage('leave')
        timeoutRef.current = setTimeout(() => {
          afterLeave?.()
          setStage(null)
          setMounted(false)
        }, 150)
      }

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [show, mounted, beforeEnter, afterEnter, beforeLeave, afterLeave])

    if (!mounted) return null

    return (
      <div
        ref={ref}
        className={cn(
          stage === 'enter' && [enter, enterFrom],
          stage === 'leave' && [leave, leaveFrom],
          stage === null && (show ? enterTo : leaveTo),
          'transition-all duration-150',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Transition.displayName = 'Transition'

export interface TransitionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement[]
  enter?: string
  enterFrom?: string
  enterTo?: string
  leave?: string
  leaveFrom?: string
  leaveTo?: string
}

export const TransitionGroup = React.forwardRef<HTMLDivElement, TransitionGroupProps>(
  ({
    className,
    enter = '',
    enterFrom = '',
    enterTo = '',
    leave = '',
    leaveFrom = '',
    leaveTo = '',
    children,
    ...props
  }, ref) => {
    const [elements, setElements] = React.useState<Array<[string | number, React.ReactElement]>>(
      React.Children.map(children, (child) => [
        child.key as string | number,
        child
      ]) || []
    )

    React.useEffect(() => {
      const currentKeys = new Set(elements.map(([key]) => key))
      const newKeys = new Set(
        React.Children.map(children, (child) => child.key as string | number)
      )

      // Remove elements that are no longer present
      currentKeys.forEach((key) => {
        if (!newKeys.has(key)) {
          setTimeout(() => {
            setElements((prev) => prev.filter(([k]) => k !== key))
          }, 150)
        }
      })

      // Add new elements
      newKeys.forEach((key) => {
        if (!currentKeys.has(key)) {
          const child = React.Children.toArray(children).find(
            (c) => (c as React.ReactElement).key === key
          ) as React.ReactElement
          setElements((prev) => [...prev, [key, child]])
        }
      })
    }, [children])

    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        {elements.map(([key, child]) => (
          <Transition
            key={key}
            show={React.Children.toArray(children).some(
              (c) => (c as React.ReactElement).key === key
            )}
            enter={enter}
            enterFrom={enterFrom}
            enterTo={enterTo}
            leave={leave}
            leaveFrom={leaveFrom}
            leaveTo={leaveTo}
          >
            {child}
          </Transition>
        ))}
      </div>
    )
  }
)
TransitionGroup.displayName = 'TransitionGroup' 