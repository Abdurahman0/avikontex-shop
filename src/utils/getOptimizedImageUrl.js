export const getOptimizedImageUrl = (imageUrl, options = {}) => {
  if (!imageUrl || !imageUrl.includes('images.pexels.com')) {
    return imageUrl
  }

  const { width = 760, height = 760 } = options
  const [baseUrl] = imageUrl.split('?')

  return `${baseUrl}?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop`
}
