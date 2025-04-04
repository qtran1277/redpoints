import * as React from 'react'
import { cn } from '@/utils/cn'

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full overflow-auto">
        <table
          ref={ref}
          className={cn('w-full caption-bottom text-sm', className)}
          {...props}
        />
      </div>
    )
  }
)
Table.displayName = 'Table'

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <thead
        ref={ref}
        className={cn('[&_tr]:border-b', className)}
        {...props}
      />
    )
  }
)
TableHeader.displayName = 'TableHeader'

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <tbody
        ref={ref}
        className={cn('[&_tr:last-child]:border-0', className)}
        {...props}
      />
    )
  }
)
TableBody.displayName = 'TableBody'

export interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <tfoot
        ref={ref}
        className={cn('bg-primary font-medium text-primary-foreground', className)}
        {...props}
      />
    )
  }
)
TableFooter.displayName = 'TableFooter'

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
          className
        )}
        {...props}
      />
    )
  }
)
TableRow.displayName = 'TableRow'

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        className={cn(
          'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
          className
        )}
        {...props}
      />
    )
  }
)
TableHead.displayName = 'TableHead'

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    return (
      <td
        ref={ref}
        className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
        {...props}
      />
    )
  }
)
TableCell.displayName = 'TableCell'

export interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <caption
        ref={ref}
        className={cn('mt-4 text-sm text-muted-foreground', className)}
        {...props}
      />
    )
  }
)
TableCaption.displayName = 'TableCaption'

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
}

export const Avatar = React.forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, src, alt, fallback, onError, ...props }, ref) => {
    const [error, setError] = React.useState(false)

    const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setError(true)
      onError?.(event)
    }

    if (error || !src) {
      return (
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full bg-muted',
            className
          )}
          {...props}
        >
          <span className="text-sm font-medium uppercase text-muted-foreground">
            {fallback || alt?.charAt(0) || '?'}
          </span>
        </div>
      )
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        onError={handleError}
        className={cn('h-10 w-10 rounded-full object-cover', className)}
        {...props}
      />
    )
  }
)
Avatar.displayName = 'Avatar'

export interface TooltipProps {
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
  children?: React.ReactNode
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, content, side = 'top', align = 'center', children }, ref) => {
    const [visible, setVisible] = React.useState(false)

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
        {visible && (
          <div
            className={cn(
              'absolute z-50 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95',
              {
                '-translate-x-1/2 left-1/2 -mt-2 top-0 transform': side === 'top' && align === 'center',
                '-translate-x-full left-0 -mt-2 top-0 transform': side === 'top' && align === 'start',
                'left-auto right-0 -mt-2 top-0': side === 'top' && align === 'end',
                '-translate-y-1/2 -mr-2 right-0 top-1/2 transform': side === 'right' && align === 'center',
                '-mr-2 right-0 top-0': side === 'right' && align === 'start',
                '-mr-2 bottom-0 right-0': side === 'right' && align === 'end',
                '-translate-x-1/2 left-1/2 -mb-2 bottom-0 transform': side === 'bottom' && align === 'center',
                '-translate-x-full left-0 -mb-2 bottom-0 transform': side === 'bottom' && align === 'start',
                'left-auto right-0 -mb-2 bottom-0': side === 'bottom' && align === 'end',
                '-translate-y-1/2 -ml-2 left-0 top-1/2 transform': side === 'left' && align === 'center',
                '-ml-2 left-0 top-0': side === 'left' && align === 'start',
                '-ml-2 bottom-0 left-0': side === 'left' && align === 'end',
              },
              className
            )}
          >
            {content}
          </div>
        )}
      </div>
    )
  }
)
Tooltip.displayName = 'Tooltip'

export interface PopoverProps {
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
  children?: React.ReactNode
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ className, content, side = 'bottom', align = 'center', children }, ref) => {
    const [visible, setVisible] = React.useState(false)

    return (
      <div
        ref={ref}
        className="relative inline-block"
      >
        <div onClick={() => setVisible(!visible)}>{children}</div>
        {visible && (
          <>
            <div
              className="fixed inset-0 z-50"
              onClick={() => setVisible(false)}
            />
            <div
              className={cn(
                'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95',
                {
                  '-translate-x-1/2 left-1/2 -mt-2 top-0 transform': side === 'top' && align === 'center',
                  '-translate-x-full left-0 -mt-2 top-0 transform': side === 'top' && align === 'start',
                  'left-auto right-0 -mt-2 top-0': side === 'top' && align === 'end',
                  '-translate-y-1/2 -mr-2 right-0 top-1/2 transform': side === 'right' && align === 'center',
                  '-mr-2 right-0 top-0': side === 'right' && align === 'start',
                  '-mr-2 bottom-0 right-0': side === 'right' && align === 'end',
                  '-translate-x-1/2 left-1/2 -mb-2 bottom-0 transform': side === 'bottom' && align === 'center',
                  '-translate-x-full left-0 -mb-2 bottom-0 transform': side === 'bottom' && align === 'start',
                  'left-auto right-0 -mb-2 bottom-0': side === 'bottom' && align === 'end',
                  '-translate-y-1/2 -ml-2 left-0 top-1/2 transform': side === 'left' && align === 'center',
                  '-ml-2 left-0 top-0': side === 'left' && align === 'start',
                  '-ml-2 bottom-0 left-0': side === 'left' && align === 'end',
                },
                className
              )}
            >
              {content}
            </div>
          </>
        )}
      </div>
    )
  }
)
Popover.displayName = 'Popover' 