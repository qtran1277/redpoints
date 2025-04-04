import * as React from 'react'
import { cn } from '@/utils/cn'
import { Check } from 'lucide-react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="peer sr-only"
              ref={ref}
              {...props}
            />
            <div className={cn(
              "w-5 h-5 border rounded transition-colors",
              "peer-checked:border-primary peer-checked:bg-primary",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20",
              error ? "border-error" : "border-gray-300",
              className
            )}>
              <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          {label && <span className="text-sm">{label}</span>}
        </label>
        {(error || helperText) && (
          <span className={cn(
            "text-xs",
            error ? "text-error" : "text-gray-500"
          )}>
            {error || helperText}
          </span>
        )}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="relative">
            <input
              type="radio"
              className="peer sr-only"
              ref={ref}
              {...props}
            />
            <div className={cn(
              "w-5 h-5 border rounded-full transition-colors",
              "peer-checked:border-primary",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20",
              error ? "border-error" : "border-gray-300",
              className
            )}>
              <div className="w-2.5 h-2.5 bg-primary rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          {label && <span className="text-sm">{label}</span>}
        </label>
        {(error || helperText) && (
          <span className={cn(
            "text-xs",
            error ? "text-error" : "text-gray-500"
          )}>
            {error || helperText}
          </span>
        )}
      </div>
    )
  }
)
Radio.displayName = 'Radio'

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="peer sr-only"
              ref={ref}
              {...props}
            />
            <div className={cn(
              "w-11 h-6 rounded-full transition-colors",
              "peer-checked:bg-primary",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20",
              error ? "bg-error/20" : "bg-gray-200",
              className
            )}>
              <div className={cn(
                "w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform",
                "peer-checked:translate-x-5"
              )} />
            </div>
          </div>
          {label && <span className="text-sm">{label}</span>}
        </label>
        {(error || helperText) && (
          <span className={cn(
            "text-xs",
            error ? "text-error" : "text-gray-500"
          )}>
            {error || helperText}
          </span>
        )}
      </div>
    )
  }
)
Switch.displayName = 'Switch'

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  label?: string
  error?: string
  helperText?: string
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, active, label, error, helperText, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <button
          ref={ref}
          className={cn(
            "px-4 py-2 rounded-lg transition-colors",
            "focus-visible:ring-2 focus-visible:ring-primary/20",
            active ? "bg-primary text-white" : "bg-gray-100 text-gray-700",
            error ? "border-error" : "",
            className
          )}
          {...props}
        >
          {label}
        </button>
        {(error || helperText) && (
          <span className={cn(
            "text-xs",
            error ? "text-error" : "text-gray-500"
          )}>
            {error || helperText}
          </span>
        )}
      </div>
    )
  }
)
Toggle.displayName = 'Toggle' 