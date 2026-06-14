const transactions = [
  {
    id: 1,
    date: '23-May-26',
    description: 'Amazon Shopping',
    entity: { id: 'sample-1', name: 'Amazon Shopping' },
    category: 'Shopping',
    type: 'debit',
    debitAmount: 200,
    creditAmount: '',
    balance: 8315.25,
    note: null
  },
  {
    id: 2,
    date: '22-May-26',
    description: 'Starbucks Coffee',
    entity: { id: 'sample-2', name: 'Starbucks Coffee' },
    category: 'Food',
    type: 'debit',
    debitAmount: 420,
    creditAmount: '',
    balance: 8515.25,
    note: null
  },
  {
    id: 3,
    date: '21-May-26',
    description: 'Uber Ride',
    entity: { id: 'sample-3', name: 'Uber Ride' },
    category: 'Travel',
    type: 'debit',
    debitAmount: 610,
    creditAmount: '',
    balance: 8935.25,
    note: null
  },
  {
    id: 4,
    date: '20-May-26',
    description: 'Netflix',
    entity: { id: 'sample-4', name: 'Netflix' },
    category: 'Subscription',
    type: 'credit',
    debitAmount: '',
    creditAmount: 562,
    balance: 9545.25,
    note: null
  },
  {
    id: 5,
    date: '19-May-26',
    description: 'Salary Credit',
    entity: { id: 'sample-5', name: 'Salary Credit' },
    category: 'Income',
    type: 'credit',
    debitAmount: '',
    creditAmount: 95000,
    balance: 10194.25,
    note: null
  }
]

export default transactions
