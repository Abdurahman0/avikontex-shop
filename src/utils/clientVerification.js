export function getClientVerification(user) {
  const client = user?.client && typeof user.client === 'object' ? user.client : null
  const clientType = client?.client_type || user?.client_type || user?.account_type || ''
  const requiresReview = ['yatt', 'yuridik', 'budjet'].includes(clientType)
  const status = client?.verification_status || null
  const canOrder = !requiresReview || client?.can_order !== false

  return {
    client,
    clientType,
    requiresReview,
    status,
    canOrder,
    isBlocked: requiresReview && client?.can_order === false,
    rejectionReason: client?.rejection_reason || '',
  }
}

export function getVerificationTone(status) {
  if (status === 'verified') return 'verified'
  if (status === 'rejected') return 'rejected'
  return 'pending'
}
