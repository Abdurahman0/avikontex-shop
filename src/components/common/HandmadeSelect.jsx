import { useEffect, useMemo, useRef, useState } from 'react'
import { HiCheck, HiChevronDown } from 'react-icons/hi2'

function HandmadeSelect({ value, options, onChange, ariaLabel }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedOption = useMemo(
    () => options.find(option => option.value === value) || options[0],
    [options, value]
  )

  useEffect(() => {
    const handleOutsideClick = event => {
      if (!containerRef.current || containerRef.current.contains(event.target)) {
        return
      }
      setIsOpen(false)
    }

    const handleEscape = event => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const pickOption = nextValue => {
    onChange(nextValue)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        aria-label={ariaLabel}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(previous => !previous)}
        className='flex w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-800 shadow-sm outline-none transition hover:border-blue-500 focus:border-blue-600'
      >
        <span className='truncate'>{selectedOption.label}</span>
        <HiChevronDown
          className={`text-lg text-slate-500 transition ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen ? (
        <div className='absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg'>
          <ul role='listbox' className='max-h-64 overflow-auto py-1'>
            {options.map(option => (
              <li key={option.value}>
                <button
                  type='button'
                  onClick={() => pickOption(option.value)}
                  className='flex w-full items-center justify-between px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-blue-50'
                >
                  <span className='truncate'>{option.label}</span>
                  {option.value === selectedOption.value ? (
                    <HiCheck className='text-base text-blue-600' />
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export default HandmadeSelect
