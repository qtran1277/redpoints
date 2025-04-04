import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'border border-input bg-background hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'text-primary underline-offset-4 hover:underline': variant === 'link',
          },
          {
            'h-9 px-4 py-2 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-8 py-2': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'sm' | 'lg'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export const ButtonGroup = ({
  children,
  className,
  size = 'default',
  variant = 'default',
}: ButtonGroupProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-md',
        className
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<ButtonProps>(child)) {
          return React.cloneElement(child, {
            className: cn(
              'rounded-none',
              index === 0 && 'rounded-l-md',
              index === React.Children.count(children) - 1 && 'rounded-r-md',
              index !== 0 && '-ml-px',
              child.props.className
            ),
            size,
            variant,
          })
        }
        return child
      })}
    </div>
  )
}

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg'
  isLoading?: boolean
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        isLoading={isLoading}
        className={cn('p-0', className)}
        {...props}
      >
        {children}
      </Button>
    )
  }
)
IconButton.displayName = 'IconButton'

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  loadingText?: string
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, variant = 'default', size = 'default', loadingText, children, ...props }, ref) => {
    const [isLoading, setIsLoading] = React.useState(false)

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (props.onClick) {
        setIsLoading(true)
        try {
          await props.onClick(event)
        } finally {
          setIsLoading(false)
        }
      }
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        isLoading={isLoading}
        onClick={handleClick}
        className={className}
        {...props}
      >
        {isLoading && loadingText ? loadingText : children}
      </Button>
    )
  }
)
LoadingButton.displayName = 'LoadingButton' 