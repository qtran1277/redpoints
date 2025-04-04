import * as React from 'react'
import { cn } from '@/utils/cn'

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  activeStep: number
  steps: {
    label: string
    description?: string
  }[]
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, activeStep, steps, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex w-full items-center', className)}
        {...props}
      >
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-1 flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium',
                  index < activeStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : index === activeStep
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground text-muted-foreground'
                )}
              >
                {index < activeStep ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={cn(
                    'text-sm font-medium',
                    index <= activeStep ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div
                    className={cn(
                      'mt-1 text-xs',
                      index <= activeStep ? 'text-muted-foreground' : 'text-muted-foreground/60'
                    )}
                  >
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-px flex-1',
                  index < activeStep ? 'bg-primary' : 'bg-muted'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    )
  }
)
Stepper.displayName = 'Stepper'

export interface NavigationMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenu = React.forwardRef<HTMLDivElement, NavigationMenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative z-10', className)}
        {...props}
      />
    )
  }
)
NavigationMenu.displayName = 'NavigationMenu'

export interface NavigationMenuListProps extends React.HTMLAttributes<HTMLUListElement> {}

export const NavigationMenuList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(
          'flex flex-1 list-none items-center justify-center space-x-1',
          className
        )}
        {...props}
      />
    )
  }
)
NavigationMenuList.displayName = 'NavigationMenuList'

export interface NavigationMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export const NavigationMenuItem = React.forwardRef<HTMLLIElement, NavigationMenuItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <li ref={ref} className={cn('relative', className)} {...props} />
    )
  }
)
NavigationMenuItem.displayName = 'NavigationMenuItem'

export interface NavigationMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
        <svg
          className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
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
      </button>
    )
  }
)
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger'

export interface NavigationMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'absolute left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
          className
        )}
        {...props}
      />
    )
  }
)
NavigationMenuContent.displayName = 'NavigationMenuContent'

export interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          className
        )}
        {...props}
      />
    )
  }
)
NavigationMenuLink.displayName = 'NavigationMenuLink' 