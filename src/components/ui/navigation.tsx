import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/utils/cn'

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, defaultValue, value, onValueChange, children, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue)

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value)
      }
    }, [value])

    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setSelectedValue(newValue)
      }
      onValueChange?.(newValue)
    }

    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<TabsListProps | TabsContentProps>(child)) {
            return React.cloneElement(child, {
              selectedValue,
              onValueChange: handleValueChange,
            } as Partial<TabsListProps | TabsContentProps>)
          }
          return child
        })}
      </div>
    )
  }
)
Tabs.displayName = 'Tabs'

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  selectedValue?: string
  onValueChange?: (value: string) => void
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, selectedValue, onValueChange, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<TabProps>(child)) {
            return React.cloneElement(child, {
              selectedValue,
              onValueChange,
            } as Partial<TabProps>)
          }
          return child
        })}
      </div>
    )
  }
)
TabsList.displayName = 'TabsList'

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  selectedValue?: string
  onValueChange?: (value: string) => void
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ className, value, selectedValue, onValueChange, ...props }, ref) => {
    const isSelected = selectedValue === value

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isSelected}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isSelected && 'bg-background text-foreground shadow-sm',
          className
        )}
        onClick={() => onValueChange?.(value)}
        {...props}
      />
    )
  }
)
Tab.displayName = 'Tab'

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  selectedValue?: string
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, selectedValue, ...props }, ref) => {
    const isSelected = selectedValue === value

    if (!isSelected) {
      return null
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...props}
      />
    )
  }
)
TabsContent.displayName = 'TabsContent'

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn('flex', className)}
        aria-label="breadcrumb"
        {...props}
      />
    )
  }
)
Breadcrumb.displayName = 'Breadcrumb'

export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
  href?: string
  isCurrent?: boolean
}

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, href, isCurrent, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn('inline-flex items-center', className)}
        aria-current={isCurrent ? 'page' : undefined}
        {...props}
      >
        {href ? (
          <a
            href={href}
            className={cn(
              'hover:text-foreground',
              isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}
          >
            {children}
          </a>
        ) : (
          <span
            className={cn(
              isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}
          >
            {children}
          </span>
        )}
        {!isCurrent && (
          <span className="mx-2 text-muted-foreground">/</span>
        )}
      </li>
    )
  }
)
BreadcrumbItem.displayName = 'BreadcrumbItem'

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  total: number
  pageSize: number
  currentPage: number
  onPageChange: (page: number) => void
}

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ className, total, pageSize, currentPage, onPageChange, ...props }, ref) => {
    const totalPages = Math.ceil(total / pageSize)
    const canPreviousPage = currentPage > 1
    const canNextPage = currentPage < totalPages

    const pages = React.useMemo(() => {
      const items: number[] = []
      const maxPages = 7
      const halfMaxPages = Math.floor(maxPages / 2)

      if (totalPages <= maxPages) {
        for (let i = 1; i <= totalPages; i++) {
          items.push(i)
        }
      } else if (currentPage <= halfMaxPages) {
        for (let i = 1; i <= maxPages - 2; i++) {
          items.push(i)
        }
        items.push(-1)
        items.push(totalPages)
      } else if (currentPage >= totalPages - halfMaxPages) {
        items.push(1)
        items.push(-1)
        for (let i = totalPages - (maxPages - 3); i <= totalPages; i++) {
          items.push(i)
        }
      } else {
        items.push(1)
        items.push(-1)
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i)
        }
        items.push(-1)
        items.push(totalPages)
      }

      return items
    }, [currentPage, totalPages])

    return (
      <nav
        ref={ref}
        className={cn('flex items-center space-x-2', className)}
        {...props}
      >
        <button
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPreviousPage}
        >
          Previous
        </button>
        {pages.map((page, i) => (
          <button
            key={i}
            className={cn(
              'inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              page === currentPage
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : page === -1
                ? 'cursor-default'
                : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
            )}
            onClick={() => page !== -1 && onPageChange(page)}
            disabled={page === -1}
          >
            {page === -1 ? '...' : page}
          </button>
        ))}
        <button
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNextPage}
        >
          Next
        </button>
      </nav>
    )
  }
)
Pagination.displayName = 'Pagination' 