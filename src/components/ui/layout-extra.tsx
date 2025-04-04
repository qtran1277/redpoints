import * as React from 'react'
import { cn } from '@/utils/cn'

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          orientation === 'horizontal' ? 'w-full' : 'h-full flex-col',
          className
        )}
        {...props}
      >
        <div className={cn(
          'flex-1',
          orientation === 'horizontal'
            ? 'h-px w-full bg-border'
            : 'h-full w-px bg-border'
        )} />
        {label && (
          <>
            <span className={cn(
              'text-sm text-muted-foreground',
              orientation === 'horizontal'
                ? 'mx-2'
                : 'my-2'
            )}>
              {label}
            </span>
            <div className={cn(
              'flex-1',
              orientation === 'horizontal'
                ? 'h-px w-full bg-border'
                : 'h-full w-px bg-border'
            )} />
          </>
        )}
      </div>
    )
  }
)
Divider.displayName = 'Divider'

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 16 / 9, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative w-full', className)}
        style={{ paddingBottom: `${(1 / ratio) * 100}%` }}
        {...props}
      >
        <div className="absolute inset-0">
          {children}
        </div>
      </div>
    )
  }
)
AspectRatio.displayName = 'AspectRatio'

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical' | 'both'
  scrollbarClassName?: string
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, orientation = 'vertical', scrollbarClassName, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          orientation === 'horizontal' && 'max-w-full',
          orientation === 'vertical' && 'max-h-full',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'overflow-auto',
            orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
            orientation === 'vertical' && 'overflow-x-hidden overflow-y-auto',
            scrollbarClassName
          )}
        >
          {children}
        </div>
      </div>
    )
  }
)
ScrollArea.displayName = 'ScrollArea'

export interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, open, onOpenChange, trigger, children, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(open)

    React.useEffect(() => {
      setIsOpen(open)
    }, [open])

    const handleToggle = () => {
      const newOpen = !isOpen
      setIsOpen(newOpen)
      onOpenChange?.(newOpen)
    }

    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        {...props}
      >
        {trigger && (
          <div
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center justify-between py-2 outline-none"
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleToggle()
              }
            }}
          >
            {trigger}
            <svg
              className={cn(
                'h-4 w-4 transition-transform',
                isOpen && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
        <div
          className={cn(
            'grid transition-all',
            isOpen
              ? 'grid-rows-[1fr]'
              : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Collapsible.displayName = 'Collapsible' 