export function getDateRange(period, customRange) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const format = (d) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  switch (period) {
    case 'current_month': {
      const start = new Date(today.getFullYear(), today.getMonth(), 1)
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)

      return { fromDate: format(start), toDate: format(end) }
    }

    case 'last_month': {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const end = new Date(today.getFullYear(), today.getMonth(), 0)

      return { fromDate: format(start), toDate: format(end) }
    }

    case 'last_3_months': {
      const start = new Date(today.getFullYear(), today.getMonth() - 3, 1)
      return { fromDate: format(start), toDate: format(today) }
    }

    case 'last_6_months': {
      const start = new Date(today.getFullYear(), today.getMonth() - 6, 1)
      return { fromDate: format(start), toDate: format(today) }
    }

    case 'last_year': {
      const start = new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      )

      return { fromDate: format(start), toDate: format(today) }
    }

    case 'custom': {
      if (!customRange?.fromDate || !customRange?.toDate) {
        return null
      }

      return customRange
    }

    default:
      return null
  }
}