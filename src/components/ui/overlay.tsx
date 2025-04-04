import * as React from 'react'
import { cn } from '@/utils/cn'

export interface DialogProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export const Dialog = ({ children, open, onOpenChange, className }: DialogProps) => {
  const [isOpen, setIsOpen] = React.useState(open)

  React.useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleClose = () => {
    setIsOpen(false)
    onOpenChange?.(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        {children}
      </div>
    </div>
  )
}

export interface DialogHeaderProps {
  children: React.ReactNode
  className?: string
}

export const DialogHeader = ({ children, className }: DialogHeaderProps) => {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 text-center sm:text-left',
        className
      )}
    >
      {children}
    </div>
  )
}

export interface DialogTitleProps {
  children: React.ReactNode
  className?: string
}

export const DialogTitle = ({ children, className }: DialogTitleProps) => {
  return (
    <h2
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className
      )}
    >
      {children}
    </h2>
  )
}

export interface DialogDescriptionProps {
  children: React.ReactNode
  className?: string
}

export const DialogDescription = ({ children, className }: DialogDescriptionProps) => {
  return (
    <p
      className={cn(
        'text-sm text-muted-foreground',
        className
      )}
    >
      {children}
    </p>
  )
}

export interface DialogContentProps {
  children: React.ReactNode
  className?: string
}

export const DialogContent = ({ children, className }: DialogContentProps) => {
  return (
    <div className={cn('py-4', className)}>
      {children}
    </div>
  )
}

export interface DialogFooterProps {
  children: React.ReactNode
  className?: string
}

export const DialogFooter = ({ children, className }: DialogFooterProps) => {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className
      )}
    >
      {children}
    </div>
  )
}

export interface DrawerProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
  side?: 'left' | 'right' | 'top' | 'bottom'
}

export const Drawer = ({
  children,
  open,
  onOpenChange,
  className,
  side = 'right',
}: DrawerProps) => {
  const [isOpen, setIsOpen] = React.useState(open)

  React.useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleClose = () => {
    setIsOpen(false)
    onOpenChange?.(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div
        className={cn(
          'fixed z-50 bg-background p-6 shadow-lg transition-all duration-300',
          {
            'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm': side === 'right',
            'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm': side === 'left',
            'inset-x-0 top-0 h-auto max-h-[75vh] border-b': side === 'top',
            'inset-x-0 bottom-0 h-auto max-h-[75vh] border-t': side === 'bottom',
          },
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export interface DrawerHeaderProps {
  children: React.ReactNode
  className?: string
}

export const DrawerHeader = ({ children, className }: DrawerHeaderProps) => {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5',
        className
      )}
    >
      {children}
    </div>
  )
}

export interface DrawerTitleProps {
  children: React.ReactNode
  className?: string
}

export const DrawerTitle = ({ children, className }: DrawerTitleProps) => {
  return (
    <h2
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className
      )}
    >
      {children}
    </h2>
  )
}

export interface DrawerDescriptionProps {
  children: React.ReactNode
  className?: string
}

export const DrawerDescription = ({ children, className }: DrawerDescriptionProps) => {
  return (
    <p
      className={cn(
        'text-sm text-muted-foreground',
        className
      )}
    >
      {children}
    </p>
  )
}

export interface DrawerContentProps {
  children: React.ReactNode
  className?: string
}

export const DrawerContent = ({ children, className }: DrawerContentProps) => {
  return (
    <div className={cn('py-4', className)}>
      {children}
    </div>
  )
}

export interface DrawerFooterProps {
  children: React.ReactNode
  className?: string
}

export const DrawerFooter = ({ children, className }: DrawerFooterProps) => {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className
      )}
    >
      {children}
    </div>
  )
} 