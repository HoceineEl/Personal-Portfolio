export const useFormatDate = (dateString: string, month: 'long' | 'short' = 'long') =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month, day: 'numeric', timeZone: 'UTC' })
