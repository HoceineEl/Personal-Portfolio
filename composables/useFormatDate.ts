export const useFormatDate = (dateString: string, month: 'long' | 'short' = 'long', locale = 'en') =>
  new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-u-nu-latn-ca-gregory' : 'en-US', {
    year: 'numeric',
    month,
    day: 'numeric',
    timeZone: 'UTC',
  })
