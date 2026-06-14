const format = (d) => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getBaseDateRange(period, customRange) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (period) {
    case 'current_month': {
      return {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today.getFullYear(), today.getMonth() + 1, 0)
      }
    }

    case 'last_month': {
      return {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0)
      }
    }

    case 'last_3_months': {
      return {
        start: new Date(today.getFullYear(), today.getMonth() - 3, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0)
      }
    }

    case 'last_6_months': {
      return {
        start: new Date(today.getFullYear(), today.getMonth() - 6, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0)
      }
    }

    case 'last_year': {
      const end = new Date(today.getFullYear(), today.getMonth(), 0)

      return {
        start: new Date(end.getFullYear() - 1, end.getMonth() + 1, 1),
        end
      }
    }

    case 'custom': {
      if (!customRange?.fromDate || !customRange?.toDate) {
        return null
      }

      return {
        start: new Date(customRange.fromDate),
        end: new Date(customRange.toDate)
      }
    }

    default:
      return null
  }
}

export function getDateRange(period, customRange) {
  const range = getBaseDateRange(period, customRange)

  if (!range) return null

  return {
    fromDate: format(range.start),
    toDate: format(range.end)
  }
}

export function getInsightDateRange(period, customRange) {
  if (period === 'custom') {
    return {
      previousPeriodStartDate: customRange.previousPeriodStartDate,
      previousPeriodEndDate: customRange.previousPeriodEndDate,
      currentPeriodStartDate: customRange.currentPeriodStartDate,
      currentPeriodEndDate: customRange.currentPeriodEndDate
    }
  }

  const range = getBaseDateRange(period, customRange)

  if (!range) return null

  const { start, end } = range

  let previousStart
  let previousEnd

  switch (period) {
    case 'current_month':
    case 'last_month':
      previousStart = new Date(start)
      previousStart.setMonth(previousStart.getMonth() - 1)

      previousEnd = new Date(start)
      previousEnd.setDate(0)
      break

    case 'last_3_months':
      previousStart = new Date(start.getFullYear(), start.getMonth() - 3, 1)

      previousEnd = new Date(start.getFullYear(), start.getMonth(), 0)

      break

    case 'last_6_months':
      previousStart = new Date(start.getFullYear(), start.getMonth() - 6, 1)

      previousEnd = new Date(start.getFullYear(), start.getMonth(), 0)

      break

    case 'last_year':
      previousStart = new Date(start)
      previousStart.setFullYear(previousStart.getFullYear() - 1)

      previousEnd = new Date(end)
      previousEnd.setFullYear(previousEnd.getFullYear() - 1)
      break

    default:
      return null
  }

  return {
    previousPeriodStartDate: format(previousStart),
    previousPeriodEndDate: format(previousEnd),
    currentPeriodStartDate: format(start),
    currentPeriodEndDate: format(end)
  }
}
