import * as React from 'react'
import { cn } from '@/utils/cn'

export interface ComboboxProps extends React.HTMLAttributes<HTMLDivElement> {
  options: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
}

export const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  ({ className, options, value, onValueChange, placeholder, disabled, error, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    const filteredOptions = React.useMemo(() => {
      return options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase())
      )
    }, [options, search])

    const selectedOption = React.useMemo(() => {
      return options.find((option) => option.value === value)
    }, [options, value])

    const handleInputClick = () => {
      if (!disabled) {
        setIsOpen(true)
      }
    }

    const handleOptionClick = (option: { value: string; label: string }) => {
      onValueChange?.(option.value)
      setIsOpen(false)
      setSearch('')
    }

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
          setSearch('')
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <input
          ref={inputRef}
          type="text"
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          placeholder={placeholder}
          value={isOpen ? search : selectedOption?.label || ''}
          onChange={(e) => setSearch(e.target.value)}
          onClick={handleInputClick}
          disabled={disabled}
        />
        {isOpen && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                    option.value === value && 'bg-accent text-accent-foreground'
                  )}
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none">
                No results found
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)
Combobox.displayName = 'Combobox'

export interface TagInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
}

export const TagInput = React.forwardRef<HTMLDivElement, TagInputProps>(
  ({ className, value = [], onValueChange, placeholder, disabled, error, ...props }, ref) => {
    const [input, setInput] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && input) {
        event.preventDefault()
        if (!value.includes(input)) {
          onValueChange?.([...value, input])
        }
        setInput('')
      } else if (event.key === 'Backspace' && !input && value.length > 0) {
        onValueChange?.(value.slice(0, -1))
      }
    }

    const handleRemoveTag = (tag: string) => {
      onValueChange?.(value.filter((t) => t !== tag))
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          error && 'border-destructive focus-within:ring-destructive',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        onClick={() => inputRef.current?.focus()}
        {...props}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className={cn(
              'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              error
                ? 'border-destructive bg-destructive/10 text-destructive hover:bg-destructive/20'
                : 'border-primary bg-primary/10 text-primary hover:bg-primary/20'
            )}
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                className="ml-1 rounded-full outline-none hover:text-muted-foreground"
                onClick={() => handleRemoveTag(tag)}
              >
                ×
              </button>
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          placeholder={value.length === 0 ? placeholder : undefined}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          disabled={disabled}
        />
      </div>
    )
  }
)
TagInput.displayName = 'TagInput'

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  onValueChange?: (value: number) => void
  max?: number
  disabled?: boolean
  error?: boolean
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ className, value = 0, onValueChange, max = 5, disabled, error, ...props }, ref) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null)

    return (
      <div
        ref={ref}
        className={cn('flex items-center space-x-1', className)}
        {...props}
      >
        {Array.from({ length: max }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={cn(
              'rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            onClick={() => !disabled && onValueChange?.(index + 1)}
            onMouseEnter={() => !disabled && setHoverValue(index + 1)}
            onMouseLeave={() => !disabled && setHoverValue(null)}
            disabled={disabled}
          >
            <svg
              className={cn(
                'h-5 w-5',
                (hoverValue !== null ? index < hoverValue : index < value)
                  ? error
                    ? 'fill-destructive text-destructive'
                    : 'fill-primary text-primary'
                  : 'fill-muted text-muted-foreground'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ))}
      </div>
    )
  }
)
Rating.displayName = 'Rating' 