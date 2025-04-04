import * as React from 'react'
import { cn } from '@/utils/cn'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  error?: boolean
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, size = 'md', showValue, error, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div
        ref={ref}
        className={cn('w-full', className)}
        {...props}
      >
        <div
          className={cn(
            'relative overflow-hidden rounded-full bg-secondary',
            {
              'h-2': size === 'sm',
              'h-4': size === 'md',
              'h-6': size === 'lg',
            }
          )}
        >
          <div
            className={cn(
              'h-full w-full flex-1 transition-all',
              error ? 'bg-destructive' : 'bg-primary'
            )}
            style={{ transform: `translateX(-${100 - percentage}%)` }}
          />
        </div>
        {showValue && (
          <div className={cn(
            'mt-1 text-right text-sm',
            error ? 'text-destructive' : 'text-foreground'
          )}>
            {percentage.toFixed(0)}%
          </div>
        )}
      </div>
    )
  }
)
Progress.displayName = 'Progress'

export interface SpinnerProps extends React.SVGAttributes<SVGElement> {
  size?: 'sm' | 'md' | 'lg'
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn(
          'animate-spin',
          {
            'h-4 w-4': size === 'sm',
            'h-6 w-6': size === 'md',
            'h-8 w-8': size === 'lg',
          },
          className
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )
  }
)
Spinner.displayName = 'Spinner'

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
}

export const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ className, lines = 3, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        {...props}
      >
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-4 animate-pulse rounded-md bg-muted',
              index === lines - 1 && 'w-4/5'
            )}
          />
        ))}
      </div>
    )
  }
)
SkeletonText.displayName = 'SkeletonText'

export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean
  text?: string
}

export const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ className, loading, text, children, ...props }, ref) => {
    if (!loading) return <>{children}</>

    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2">
            <Spinner />
            {text && (
              <p className="text-sm text-muted-foreground">{text}</p>
            )}
          </div>
        </div>
        <div className="pointer-events-none opacity-50">
          {children}
        </div>
      </div>
    )
  }
)
LoadingOverlay.displayName = 'LoadingOverlay' 