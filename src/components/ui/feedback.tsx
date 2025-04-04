import * as React from 'react'
import { cn } from '@/utils/cn'

export interface FeedbackProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

export const Feedback = React.forwardRef<HTMLDivElement, FeedbackProps>(
  ({ className, variant = 'info', title, description, icon, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative flex w-full gap-4 rounded-lg border p-4',
          {
            'border-green-500/50 bg-green-50 text-green-700 dark:border-green-500 dark:bg-green-950 dark:text-green-300': variant === 'success',
            'border-yellow-500/50 bg-yellow-50 text-yellow-700 dark:border-yellow-500 dark:bg-yellow-950 dark:text-yellow-300': variant === 'warning',
            'border-red-500/50 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950 dark:text-red-300': variant === 'error',
            'border-blue-500/50 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-300': variant === 'info',
          },
          className
        )}
        {...props}
      >
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div className="flex-1">
          {title && <FeedbackTitle>{title}</FeedbackTitle>}
          {description && <FeedbackDescription>{description}</FeedbackDescription>}
          {props.children}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    )
  }
)
Feedback.displayName = 'Feedback'

export interface FeedbackTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const FeedbackTitle = React.forwardRef<HTMLHeadingElement, FeedbackTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  )
)
FeedbackTitle.displayName = 'FeedbackTitle'

export interface FeedbackDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const FeedbackDescription = React.forwardRef<HTMLParagraphElement, FeedbackDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
)
FeedbackDescription.displayName = 'FeedbackDescription' 