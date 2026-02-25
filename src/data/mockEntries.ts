export interface Entry {
  id: number
  title: string
  body: string
  date: string
  streaks: number
  isRecent?: boolean
}

export const currentEntries: Entry[] = [
  {
    id: 1,
    title: 'Focus during exams',
    body: 'Praying for clarity of mind and peace during my upcoming finals week. I need to retain the information I\'ve studied and stay calm under pressure.',
    date: '2 days ago',
    streaks: 12,
    isRecent: true,
  },
  {
    id: 2,
    title: 'Health recovery',
    body: 'Asking for strength and healing for my knee injury so I can get back to running. It\'s been a tough few weeks of physical therapy and rest.',
    date: '1 week ago',
    streaks: 5,
  },
  {
    id: 3,
    title: 'Guidance for career',
    body: 'Seeking direction on whether to accept the new job offer in Seattle or stay in my current role. It\'s a big decision for my family and future.',
    date: '2 weeks ago',
    streaks: 14,
  },
  {
    id: 4,
    title: 'Patience with kids',
    body: 'Lord, give me the patience to handle the toddlers\' tantrums with grace and love, not frustration.',
    date: 'Yesterday',
    streaks: 1,
    isRecent: true,
  },
  {
    id: 5,
    title: 'Financial Peace',
    body: 'Trusting for provision regarding the unexpected car repairs this month. Help me to be a good steward of what I have.',
    date: '3 weeks ago',
    streaks: 21,
  },
]

export const longtermEntries: Entry[] = [
  {
    id: 101,
    title: 'Marriage restoration',
    body: 'Continuing to pray for healing and restoration in our marriage. Help us communicate better and grow closer each day.',
    date: '1 month ago',
    streaks: 45,
    isRecent: true,
  },
  {
    id: 102,
    title: 'Children\'s faith journey',
    body: 'Praying that my children will develop a deep, personal relationship with God as they grow. May they find their own path to faith.',
    date: '3 months ago',
    streaks: 90,
  },
  {
    id: 103,
    title: 'Community impact',
    body: 'Lord, use me to make a lasting difference in my neighborhood. Open doors for service and genuine connection with those around me.',
    date: '2 months ago',
    streaks: 32,
  },
  {
    id: 104,
    title: 'Overcoming anxiety',
    body: 'A lifelong struggle with anxiety. Praying for sustained peace, better coping strategies, and trust in God\'s plan for my life.',
    date: '6 months ago',
    streaks: 120,
    isRecent: true,
  },
  {
    id: 105,
    title: 'Missions calling',
    body: 'Discerning whether God is calling our family to serve overseas. Seeking clarity, courage, and open doors if this is the right path.',
    date: '4 months ago',
    streaks: 67,
  },
]
