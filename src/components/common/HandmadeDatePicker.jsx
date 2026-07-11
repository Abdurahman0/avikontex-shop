import { useEffect, useId, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  HiChevronLeft,
  HiChevronRight,
  HiOutlineCalendarDays,
  HiOutlineXMark,
} from 'react-icons/hi2'
import { useTranslation } from 'react-i18next'

const DAYS_IN_GRID = 42
const YEARS_PER_PAGE = 12

const pad2 = value => String(value).padStart(2, '0')

function parseIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '')
  if (!match) return null

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(date.getTime()) ? null : date
}

function toIsoDate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isSameDay(left, right) {
  return Boolean(
    left &&
      right &&
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
  )
}

function isWithinRange(date, minDate, maxDate) {
  const timestamp = startOfDay(date).getTime()
  return (!minDate || timestamp >= minDate.getTime()) && (!maxDate || timestamp <= maxDate.getTime())
}

function getInitialView(value, initialViewDate, maxDate) {
  return parseIsoDate(value) || parseIsoDate(initialViewDate) || maxDate || startOfDay(new Date())
}

export default function HandmadeDatePicker({
  label,
  value,
  onChange,
  error,
  min,
  max,
  initialViewDate,
  required = false,
}) {
  const { t } = useTranslation()
  const labelId = useId()
  const rootRef = useRef(null)
  const selectedDate = useMemo(() => parseIsoDate(value), [value])
  const minDate = useMemo(() => parseIsoDate(min), [min])
  const maxDate = useMemo(() => parseIsoDate(max), [max])
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState('days')
  const [viewDate, setViewDate] = useState(() => getInitialView(value, initialViewDate, maxDate))

  const months = t('calendar.months', { returnObjects: true })
  const monthsShort = t('calendar.monthsShort', { returnObjects: true })
  const weekdays = t('calendar.weekdaysShort', { returnObjects: true })

  useEffect(() => {
    const closeOnOutsideClick = event => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false)
    }
    const closeOnEscape = event => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  useEffect(() => {
    if (selectedDate) setViewDate(selectedDate)
  }, [selectedDate])

  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
    const mondayBasedOffset = (firstOfMonth.getDay() + 6) % 7
    const firstCell = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1 - mondayBasedOffset)

    return Array.from({ length: DAYS_IN_GRID }, (_, index) => {
      const date = new Date(firstCell)
      date.setDate(firstCell.getDate() + index)
      return date
    })
  }, [viewDate])

  const yearPageStart = Math.floor(viewDate.getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE

  const openCalendar = () => {
    setViewDate(getInitialView(value, initialViewDate, maxDate))
    setMode('days')
    setIsOpen(previous => !previous)
  }

  const move = direction => {
    if (mode === 'years') {
      setViewDate(current => new Date(current.getFullYear() + direction * YEARS_PER_PAGE, current.getMonth(), 1))
      return
    }
    if (mode === 'months') {
      setViewDate(current => new Date(current.getFullYear() + direction, current.getMonth(), 1))
      return
    }
    setViewDate(current => new Date(current.getFullYear(), current.getMonth() + direction, 1))
  }

  const chooseDate = date => {
    if (!isWithinRange(date, minDate, maxDate)) return
    onChange(toIsoDate(date))
    setViewDate(date)
    setIsOpen(false)
  }

  const chooseMonth = monthIndex => {
    setViewDate(current => new Date(current.getFullYear(), monthIndex, 1))
    setMode('days')
  }

  const chooseYear = year => {
    setViewDate(current => new Date(year, current.getMonth(), 1))
    setMode('months')
  }

  const displayValue = selectedDate
    ? `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : t('calendar.placeholder')

  const headerLabel =
    mode === 'years'
      ? `${yearPageStart} - ${yearPageStart + YEARS_PER_PAGE - 1}`
      : mode === 'months'
        ? String(viewDate.getFullYear())
        : `${months[viewDate.getMonth()]} ${viewDate.getFullYear()}`

  return (
    <div ref={rootRef} className='relative min-w-0'>
      <label className='mb-1.5 block text-sm font-semibold text-slate-700' id={labelId}>
        {label}
      </label>
      <button
        type='button'
        aria-labelledby={labelId}
        aria-haspopup='dialog'
        aria-expanded={isOpen}
        aria-invalid={Boolean(error)}
        aria-required={required}
        onClick={openCalendar}
        className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-3 text-left text-sm outline-none transition focus:ring-4 ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
            : isOpen
              ? 'border-blue-600 ring-4 ring-blue-100'
              : 'border-slate-300 hover:border-blue-500 focus:border-blue-600 focus:ring-blue-100'
        }`}
      >
        <span className={selectedDate ? 'font-semibold text-slate-900' : 'text-slate-400'}>{displayValue}</span>
        <HiOutlineCalendarDays className='shrink-0 text-xl text-blue-700' />
      </button>
      {error ? <p className='mt-1.5 text-xs font-medium text-red-600'>{error}</p> : null}

      {isOpen ? (
        <div
          role='dialog'
          aria-modal='false'
          aria-label={t('calendar.dialogLabel')}
          className='absolute left-0 right-0 top-[calc(100%+8px)] z-50 min-w-[17.5rem] overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.45)] sm:p-4'
        >
          <div className='flex items-center justify-between gap-2'>
            <button
              type='button'
              onClick={() => move(-1)}
              aria-label={t(mode === 'years' ? 'calendar.previousYears' : 'calendar.previousMonth')}
              className='flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-blue-700'
            >
              <HiChevronLeft className='text-xl' />
            </button>
            <button
              type='button'
              onClick={() => setMode(current => (current === 'days' ? 'months' : current === 'months' ? 'years' : 'days'))}
              className='min-w-0 flex-1 rounded-xl px-2 py-2 text-sm font-black text-slate-950 transition hover:bg-blue-50 hover:text-blue-700'
            >
              {headerLabel}
            </button>
            <button
              type='button'
              onClick={() => move(1)}
              aria-label={t(mode === 'years' ? 'calendar.nextYears' : 'calendar.nextMonth')}
              className='flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-blue-700'
            >
              <HiChevronRight className='text-xl' />
            </button>
          </div>

          {mode === 'days' ? (
            <>
              <div className='mt-3 grid grid-cols-7 gap-1'>
                {weekdays.map(day => (
                  <span key={day} className='py-1 text-center text-[11px] font-black uppercase text-slate-400'>
                    {day}
                  </span>
                ))}
                {calendarDays.map(date => {
                  const isSelected = isSameDay(date, selectedDate)
                  const isToday = isSameDay(date, startOfDay(new Date()))
                  const isCurrentMonth = date.getMonth() === viewDate.getMonth()
                  const isDisabled = !isWithinRange(date, minDate, maxDate)

                  return (
                    <button
                      key={toIsoDate(date)}
                      type='button'
                      disabled={isDisabled}
                      onClick={() => chooseDate(date)}
                      aria-label={`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`}
                      aria-pressed={isSelected}
                      className={`relative aspect-square rounded-xl text-sm font-bold transition ${
                        isSelected
                          ? 'bg-blue-700 text-white shadow-md shadow-blue-200'
                          : isDisabled
                            ? 'cursor-not-allowed text-slate-200'
                            : isCurrentMonth
                              ? 'text-slate-800 hover:bg-blue-50 hover:text-blue-700'
                              : 'text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {date.getDate()}
                      {isToday && !isSelected ? (
                        <span className='absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-blue-600' />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </>
          ) : null}

          {mode === 'months' ? (
            <div className='mt-3 grid grid-cols-3 gap-2'>
              {monthsShort.map((month, index) => (
                <button
                  key={month}
                  type='button'
                  onClick={() => chooseMonth(index)}
                  className={`rounded-xl px-2 py-3 text-sm font-bold transition ${
                    index === viewDate.getMonth()
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          ) : null}

          {mode === 'years' ? (
            <div className='mt-3 grid grid-cols-3 gap-2'>
              {Array.from({ length: YEARS_PER_PAGE }, (_, index) => yearPageStart + index).map(year => {
                const isDisabled =
                  (minDate && year < minDate.getFullYear()) || (maxDate && year > maxDate.getFullYear())
                return (
                  <button
                    key={year}
                    type='button'
                    disabled={isDisabled}
                    onClick={() => chooseYear(year)}
                    className={`rounded-xl px-2 py-3 text-sm font-bold transition ${
                      year === viewDate.getFullYear()
                        ? 'bg-blue-700 text-white'
                        : isDisabled
                          ? 'cursor-not-allowed bg-slate-50 text-slate-300'
                          : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    {year}
                  </button>
                )
              })}
            </div>
          ) : null}

          <div className='mt-3 flex items-center justify-between border-t border-slate-100 pt-3'>
            <button
              type='button'
              onClick={() => {
                onChange('')
                setIsOpen(false)
              }}
              className='inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900'
            >
              <HiOutlineXMark className='text-base' />
              {t('calendar.clear')}
            </button>
            <span className='text-xs font-semibold text-slate-400'>{value || t('calendar.isoFormat')}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}

HandmadeDatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
  initialViewDate: PropTypes.string,
  required: PropTypes.bool,
}
