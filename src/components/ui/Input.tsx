import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

const inputClasses =
  'w-full px-4 py-3 rounded-lg bg-surface border border-default text-primary placeholder:text-muted focus:border-accent focus:outline-none transition-colors'

export function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input id={id} className={`${inputClasses} ${className}`} {...props} />
    </div>
  )
}

export function Textarea({ label, id, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id={id}
        className={`${inputClasses} resize-none ${className}`}
        rows={5}
        {...props}
      />
    </div>
  )
}
