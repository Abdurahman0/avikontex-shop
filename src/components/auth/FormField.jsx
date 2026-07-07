import { useState } from 'react'
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'
import PropTypes from 'prop-types'

export default function FormField({ label, error, hint, type = 'text', className = '', ...props }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'

  return (
    <label className={`block ${className}`}>
      <span className='mb-1.5 block text-sm font-semibold text-slate-700'>{label}</span>
      <span className='relative block'>
        <input
          {...props}
          type={isPassword && showPassword ? 'text' : type}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
          } ${isPassword ? 'pr-11' : ''}`}
        />
        {isPassword ? (
          <button
            type='button'
            onClick={() => setShowPassword(value => !value)}
            className='absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-blue-700'
            aria-label={props['data-visibility-label']}
          >
            {showPassword ? <HiOutlineEyeSlash className='text-lg' /> : <HiOutlineEye className='text-lg' />}
          </button>
        ) : null}
      </span>
      {error ? <span className='mt-1.5 block text-xs font-medium text-red-600'>{error}</span> : null}
      {!error && hint ? <span className='mt-1.5 block text-xs text-slate-500'>{hint}</span> : null}
    </label>
  )
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  'data-visibility-label': PropTypes.string,
}
