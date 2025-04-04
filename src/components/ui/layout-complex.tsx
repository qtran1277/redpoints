import * as React from 'react'
import { cn } from '@/utils/cn'

type ResponsiveValue = number | { sm?: number; md?: number; lg?: number; xl?: number }

const getResponsiveValue = (value: ResponsiveValue | undefined, defaultValue?: number) => {
  if (typeof value === 'number') {
    return value
  }
  if (!value) return defaultValue
  return {
    'sm': value.sm || defaultValue,
    'md': value.md || value.sm || defaultValue,
    'lg': value.lg || value.md || value.sm || defaultValue,
    'xl': value.xl || value.lg || value.md || value.sm || defaultValue,
  }
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: ResponsiveValue
  rows?: ResponsiveValue
  gap?: ResponsiveValue
  autoFlow?: 'row' | 'column' | 'dense'
  autoRows?: string
  autoCols?: string
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, rows, gap, autoFlow, autoRows, autoCols, children, ...props }, ref) => {
    const getGridCols = () => {
      const colsValue = getResponsiveValue(cols)
      if (typeof colsValue === 'number') {
        return `grid-cols-${colsValue}`
      }
      if (!colsValue) return undefined
      return {
        'sm': colsValue.sm ? `sm:grid-cols-${colsValue.sm}` : undefined,
        'md': colsValue.md ? `md:grid-cols-${colsValue.md}` : undefined,
        'lg': colsValue.lg ? `lg:grid-cols-${colsValue.lg}` : undefined,
        'xl': colsValue.xl ? `xl:grid-cols-${colsValue.xl}` : undefined,
      }
    }

    const getGridRows = () => {
      const rowsValue = getResponsiveValue(rows)
      if (typeof rowsValue === 'number') {
        return `grid-rows-${rowsValue}`
      }
      if (!rowsValue) return undefined
      return {
        'sm': rowsValue.sm ? `sm:grid-rows-${rowsValue.sm}` : undefined,
        'md': rowsValue.md ? `md:grid-rows-${rowsValue.md}` : undefined,
        'lg': rowsValue.lg ? `lg:grid-rows-${rowsValue.lg}` : undefined,
        'xl': rowsValue.xl ? `xl:grid-rows-${rowsValue.xl}` : undefined,
      }
    }

    const getGridGap = () => {
      const gapValue = getResponsiveValue(gap)
      if (typeof gapValue === 'number') {
        return `gap-${gapValue}`
      }
      if (!gapValue) return undefined
      return {
        'sm': gapValue.sm ? `sm:gap-${gapValue.sm}` : undefined,
        'md': gapValue.md ? `md:gap-${gapValue.md}` : undefined,
        'lg': gapValue.lg ? `lg:gap-${gapValue.lg}` : undefined,
        'xl': gapValue.xl ? `xl:gap-${gapValue.xl}` : undefined,
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          getGridCols(),
          getGridRows(),
          getGridGap(),
          autoFlow && `auto-flow-${autoFlow}`,
          autoRows && `auto-rows-${autoRows}`,
          autoCols && `auto-cols-${autoCols}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Grid.displayName = 'Grid'

export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: ResponsiveValue
  gap?: ResponsiveValue
}

export const Masonry = React.forwardRef<HTMLDivElement, MasonryProps>(
  ({ className, columns = 1, gap = 4, children, ...props }, ref) => {
    const [columnElements, setColumnElements] = React.useState<React.ReactNode[][]>([])
    const containerRef = React.useRef<HTMLDivElement>(null)
    const resizeObserverRef = React.useRef<ResizeObserver | null>(null)

    const getColumnCount = () => {
      const width = containerRef.current?.offsetWidth || 0
      const responsiveColumns = getResponsiveValue(columns, 1)
      if (typeof responsiveColumns === 'number') {
        return responsiveColumns
      }
      if (!responsiveColumns) return 1
      if (width >= 1280) return responsiveColumns.xl || 1
      if (width >= 1024) return responsiveColumns.lg || 1
      if (width >= 768) return responsiveColumns.md || 1
      return responsiveColumns.sm || 1
    }

    React.useEffect(() => {
      if (!containerRef.current) return

      resizeObserverRef.current = new ResizeObserver(() => {
        const columnCount = getColumnCount()
        const childrenArray = React.Children.toArray(children)
        const newColumnElements: React.ReactNode[][] = Array.from(
          { length: columnCount },
          () => []
        )

        childrenArray.forEach((child, index) => {
          const columnIndex = index % columnCount
          newColumnElements[columnIndex].push(child)
        })

        setColumnElements(newColumnElements)
      })

      resizeObserverRef.current.observe(containerRef.current)

      return () => {
        resizeObserverRef.current?.disconnect()
      }
    }, [children, columns])

    return (
      <div
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        <div
          ref={containerRef}
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${getColumnCount()}, minmax(0, 1fr))`,
            gap: typeof gap === 'number' ? `${gap * 0.25}rem` : undefined,
          }}
        >
          {columnElements.map((column, index) => (
            <div key={index} className="flex flex-col">
              {column}
            </div>
          ))}
        </div>
      </div>
    )
  }
)
Masonry.displayName = 'Masonry'

export interface VirtualListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: any[]
  itemHeight: number
  overscan?: number
  renderItem: (item: any, index: number) => React.ReactNode
}

export const VirtualList = React.forwardRef<HTMLDivElement, VirtualListProps>(
  ({ className, items, itemHeight, overscan = 3, renderItem, ...props }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [scrollTop, setScrollTop] = React.useState(0)
    const [containerHeight, setContainerHeight] = React.useState(0)

    const totalHeight = items.length * itemHeight
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    const visibleItems = items.slice(startIndex, endIndex)
    const offsetY = startIndex * itemHeight

    React.useEffect(() => {
      if (!containerRef.current) return

      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerHeight(entry.contentRect.height)
        }
      })

      resizeObserver.observe(containerRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }, [])

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(event.currentTarget.scrollTop)
    }

    return (
      <div
        ref={ref}
        className={cn('relative overflow-auto', className)}
        onScroll={handleScroll}
        {...props}
      >
        <div
          ref={containerRef}
          style={{ height: totalHeight }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              transform: `translateY(${offsetY}px)`,
            }}
          >
            {visibleItems.map((item, index) =>
              renderItem(item, startIndex + index)
            )}
          </div>
        </div>
      </div>
    )
  }
)
VirtualList.displayName = 'VirtualList' 