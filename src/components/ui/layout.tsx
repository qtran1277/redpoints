import * as React from 'react'
import { cn } from '@/utils/cn'

export interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </div>
  )
}

export interface GridProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
}

export const Grid = ({ children, className, cols = 1, gap = 4 }: GridProps) => {
  return (
    <div
      className={cn(
        'grid',
        {
          'grid-cols-1': cols === 1,
          'grid-cols-2': cols === 2,
          'grid-cols-3': cols === 3,
          'grid-cols-4': cols === 4,
          'grid-cols-5': cols === 5,
          'grid-cols-6': cols === 6,
          'grid-cols-7': cols === 7,
          'grid-cols-8': cols === 8,
          'grid-cols-9': cols === 9,
          'grid-cols-10': cols === 10,
          'grid-cols-11': cols === 11,
          'grid-cols-12': cols === 12,
        },
        {
          'gap-0': gap === 0,
          'gap-1': gap === 1,
          'gap-2': gap === 2,
          'gap-3': gap === 3,
          'gap-4': gap === 4,
          'gap-5': gap === 5,
          'gap-6': gap === 6,
          'gap-8': gap === 8,
          'gap-10': gap === 10,
          'gap-12': gap === 12,
          'gap-16': gap === 16,
        },
        className
      )}
    >
      {children}
    </div>
  )
}

export interface FlexProps {
  children: React.ReactNode
  className?: string
  direction?: 'row' | 'col'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
  wrap?: boolean
}

export const Flex = ({
  children,
  className,
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = 0,
  wrap = false,
}: FlexProps) => {
  return (
    <div
      className={cn(
        'flex',
        {
          'flex-row': direction === 'row',
          'flex-col': direction === 'col',
        },
        {
          'justify-start': justify === 'start',
          'justify-end': justify === 'end',
          'justify-center': justify === 'center',
          'justify-between': justify === 'between',
          'justify-around': justify === 'around',
          'justify-evenly': justify === 'evenly',
        },
        {
          'items-start': align === 'start',
          'items-end': align === 'end',
          'items-center': align === 'center',
          'items-baseline': align === 'baseline',
          'items-stretch': align === 'stretch',
        },
        {
          'gap-0': gap === 0,
          'gap-1': gap === 1,
          'gap-2': gap === 2,
          'gap-3': gap === 3,
          'gap-4': gap === 4,
          'gap-5': gap === 5,
          'gap-6': gap === 6,
          'gap-8': gap === 8,
          'gap-10': gap === 10,
          'gap-12': gap === 12,
          'gap-16': gap === 16,
        },
        {
          'flex-wrap': wrap,
        },
        className
      )}
    >
      {children}
    </div>
  )
}

export interface StackProps {
  children: React.ReactNode
  className?: string
  direction?: 'row' | 'col'
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
}

export const Stack = ({ children, className, direction = 'col', gap = 4 }: StackProps) => {
  return (
    <Flex
      direction={direction}
      gap={gap}
      className={className}
    >
      {children}
    </Flex>
  )
}

export interface DividerProps {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export const Divider = ({ className, orientation = 'horizontal' }: DividerProps) => {
  return (
    <div
      className={cn(
        'bg-border',
        {
          'h-px w-full': orientation === 'horizontal',
          'h-full w-px': orientation === 'vertical',
        },
        className
      )}
    />
  )
} 