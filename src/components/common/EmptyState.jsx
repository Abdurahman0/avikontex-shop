import PropTypes from 'prop-types'

function EmptyState({ title, description, action }) {
  return (
    <div className='rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center'>
      <h2 className='text-xl font-semibold text-slate-900'>{title}</h2>
      <p className='mt-2 text-sm text-slate-500'>{description}</p>
      {action ? <div className='mt-5'>{action}</div> : null}
    </div>
  )
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.node,
}

export default EmptyState
