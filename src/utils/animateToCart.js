export const animateToCart = (sourceElement, productImageSrc) => {
  if (!sourceElement || typeof window === 'undefined') {
    return
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const cartTarget = document.querySelector('[data-cart-icon="true"]')
  if (!cartTarget) {
    return
  }

  const sourceRect = sourceElement.getBoundingClientRect()
  const cartRect = cartTarget.getBoundingClientRect()
  const fallbackImage =
    sourceElement.currentSrc ||
    sourceElement.src ||
    sourceElement
      .closest('article')
      ?.querySelector('img')
      ?.getAttribute('src')
  const imageSrc = productImageSrc || fallbackImage
  if (!imageSrc) {
    return
  }

  const flyNode = document.createElement('img')

  flyNode.src = imageSrc
  flyNode.alt = ''
  flyNode.setAttribute('aria-hidden', 'true')
  flyNode.style.position = 'fixed'
  flyNode.style.left = `${sourceRect.left + sourceRect.width / 2 - 21}px`
  flyNode.style.top = `${sourceRect.top + sourceRect.height / 2 - 21}px`
  flyNode.style.width = '42px'
  flyNode.style.height = '42px'
  flyNode.style.objectFit = 'cover'
  flyNode.style.borderRadius = '999px'
  flyNode.style.pointerEvents = 'none'
  flyNode.style.zIndex = '80'
  flyNode.style.boxShadow = '0 10px 24px rgba(15, 23, 42, 0.22)'
  flyNode.style.transition =
    'transform 620ms cubic-bezier(0.2, 0.84, 0.3, 1), opacity 620ms ease'
  flyNode.style.transformOrigin = 'center center'

  document.body.appendChild(flyNode)

  const startX = sourceRect.left + sourceRect.width / 2 - flyNode.offsetWidth / 2
  const startY = sourceRect.top + sourceRect.height / 2 - flyNode.offsetHeight / 2
  const endX = cartRect.left + cartRect.width / 2 - flyNode.offsetWidth / 2
  const endY = cartRect.top + cartRect.height / 2 - flyNode.offsetHeight / 2
  const moveX = endX - startX
  const moveY = endY - startY

  requestAnimationFrame(() => {
    flyNode.style.transform = `translate(${moveX}px, ${moveY}px) scale(0.28)`
    flyNode.style.opacity = '0.4'
  })

  cartTarget.classList.add('cart-bump')

  window.setTimeout(() => {
    cartTarget.classList.remove('cart-bump')
    flyNode.remove()
  }, 680)
}
