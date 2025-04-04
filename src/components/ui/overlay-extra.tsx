import * as React from 'react'
import { cn } from '@/utils/cn'

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
          className
        )}
        {...props}
      />
    )
  }
)
Menu.displayName = 'Menu'

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean
}

export const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({ className, inset, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          inset && 'pl-8',
          className
        )}
        {...props}
      />
    )
  }
)
MenuItem.displayName = 'MenuItem'

export interface MenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

export const MenuLabel = React.forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ className, inset, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-2 py-1.5 text-sm font-semibold',
          inset && 'pl-8',
          className
        )}
        {...props}
      />
    )
  }
)
MenuLabel.displayName = 'MenuLabel'

export interface MenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('-mx-1 my-1 h-px bg-muted', className)}
        {...props}
      />
    )
  }
)
MenuSeparator.displayName = 'MenuSeparator'

export interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean
  onClose?: () => void
  position?: 'left' | 'right' | 'top' | 'bottom'
}

export const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ className, open, onClose, position = 'right', children, ...props }, ref) => {
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && open) {
          onClose?.()
        }
      }

      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [open, onClose])

    if (!open) return null

    return (
      <>
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <div
          ref={ref}
          className={cn(
            'fixed z-50 gap-4 bg-background p-6 shadow-lg',
            {
              'inset-y-0 left-0 h-full w-3/4 border-r': position === 'left',
              'inset-y-0 right-0 h-full w-3/4 border-l': position === 'right',
              'inset-x-0 top-0 h-96 border-b': position === 'top',
              'inset-x-0 bottom-0 h-96 border-t': position === 'bottom',
            },
            className
          )}
          {...props}
        >
          {children}
        </div>
      </>
    )
  }
)
Sheet.displayName = 'Sheet'

export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-2', className)}
        {...props}
      />
    )
  }
)
SheetHeader.displayName = 'SheetHeader'

export interface SheetTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h2
        ref={ref}
        className={cn('text-lg font-semibold', className)}
        {...props}
      />
    )
  }
)
SheetTitle.displayName = 'SheetTitle'

export interface SheetDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const SheetDescription = React.forwardRef<HTMLParagraphElement, SheetDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-muted-foreground', className)}
        {...props}
      />
    )
  }
)
SheetDescription.displayName = 'SheetDescription'

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1 overflow-auto py-4', className)}
        {...props}
      />
    )
  }
)
SheetContent.displayName = 'SheetContent'

export interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SheetFooter = React.forwardRef<HTMLDivElement, SheetFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
        {...props}
      />
    )
  }
)
SheetFooter.displayName = 'SheetFooter' 