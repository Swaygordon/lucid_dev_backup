// ─────────────────────────────────────────────────────────────────────────────
// Phase 5 mock data — Dashboard, Earnings, Transactions, Favourites
//
// REMOVE THIS FILE when Phase 5 backend integration lands. Pages importing
// from here should switch to real fetch calls against the endpoints listed in
// each function's [API] comment.
//
// All getters return Promises with a small simulated latency so calling pages
// can keep their useEffect/await shape — swap is a one-liner per function.
// ─────────────────────────────────────────────────────────────────────────────

const sleep = (ms = 250) => new Promise(r => setTimeout(r, ms));

// ─── Bookings ────────────────────────────────────────────────────────────────
// Used by client_dashboard and provider_dashboard for their booking previews.
// (Phase 4 owns full booking pages — this is the summary shape.)
const BOOKINGS = [
  {
    id: 'bk_001',
    status: 'in-progress',
    service: 'Electrical Wiring Repair',
    providerName: 'John Mensah',
    providerId: 'pr_001',
    clientName: 'Akua Mensah',
    clientId: 'cl_001',
    location: 'Spintex, Accra',
    date: '2026-05-28',
    time: '10:00 AM',
    price: 250,
    agreedPrice: 250,
    paymentStatus: 'unpaid',
    rating: null,
  },
  {
    id: 'bk_002',
    status: 'confirmed',
    service: 'Bathroom Plumbing',
    providerName: 'Yaw Boateng',
    providerId: 'pr_002',
    clientName: 'Kofi Anane',
    clientId: 'cl_002',
    location: 'East Legon, Accra',
    date: '2026-05-30',
    time: '2:00 PM',
    price: 180,
    agreedPrice: 180,
    paymentStatus: 'unpaid',
    rating: null,
  },
  {
    id: 'bk_003',
    status: 'pending',
    service: 'AC Installation',
    providerName: 'Samuel Owusu',
    providerId: 'pr_003',
    clientName: 'Nana Adjei',
    clientId: 'cl_003',
    location: 'Cantonments, Accra',
    date: '2026-06-02',
    time: '9:00 AM',
    price: 400,
    agreedPrice: null,
    paymentStatus: 'unpaid',
    rating: null,
  },
  {
    id: 'bk_004',
    status: 'completed',
    service: 'House Cleaning',
    providerName: 'Esi Asante',
    providerId: 'pr_004',
    clientName: 'Maame Yaa',
    clientId: 'cl_004',
    location: 'Osu, Accra',
    date: '2026-05-20',
    time: '8:00 AM',
    price: 120,
    agreedPrice: 120,
    paymentStatus: 'paid',
    rating: 5,
  },
];

// [API] GET /bookings?clientId={id}&status=pending,confirmed,in-progress
export const getClientBookings = async () => {
  await sleep();
  return BOOKINGS.filter(b => b.clientId === 'cl_001' || true);
};

// [API] GET /bookings?providerId={id}&status=pending,confirmed,in-progress
export const getProviderBookings = async () => {
  await sleep();
  return BOOKINGS;
};

// ─── Dashboard stats ─────────────────────────────────────────────────────────
// [API] GET /users/:id/stats?period={week|month|year}
export const getClientStats = async () => {
  await sleep(200);
  return {
    activeBookings: 2,
    completedJobs: 14,
    totalSpent: 1840,
    favouritesCount: 6,
  };
};

// [API] GET /providers/:id/stats?period={week|month|year}
export const getProviderStats = async () => {
  await sleep(200);
  return {
    totalJobs: 47,
    totalEarnings: 8420,
    avgRating: 4.7,
    totalClients: 34,
  };
};

// ─── Activity feed ───────────────────────────────────────────────────────────
// [API] GET /activity-feed?userId={id}&limit=4
// Icon names are strings; calling page maps them to lucide-react components.
export const getClientActivityFeed = async () => {
  await sleep();
  return [
    { iconName: 'CheckCircle',    title: 'Service Completed',  description: 'Plumbing repair at Osu completed successfully',     time: '2 hours ago', actionLabel: 'Leave Review', to: '/lucid/bookings' },
    { iconName: 'MessageSquare',  title: 'New Message',        description: 'Gabriel replied to your inquiry',                    time: '4 hours ago', actionLabel: 'View Message', to: '/lucid/messages' },
    { iconName: 'Calendar',       title: 'Booking Confirmed',  description: 'Electrical installation scheduled for tomorrow',     time: '1 day ago',   actionLabel: null,           to: '/lucid/bookings' },
    { iconName: 'Star',           title: 'Review Posted',      description: 'Your review for John Mensah has been published',     time: '2 days ago',  actionLabel: null,           to: '/lucid/providers/me' },
  ];
};

export const getProviderActivityFeed = async () => {
  await sleep();
  return [
    { iconName: 'CheckCircle',   title: 'Job Completed',     description: 'Electrical service at Spintex',                 time: '2 hours ago', status: 'completed', to: '/lucid/bookings' },
    { iconName: 'MessageSquare', title: 'New Message',       description: 'Client inquiry about electrical work',          time: '4 hours ago', status: 'new',       to: '/lucid/messages' },
    { iconName: 'Star',          title: 'New Review',        description: 'Nana Kofi left a 5-star review',                time: '1 day ago',   status: 'new',       to: '/lucid/providers/me' },
    { iconName: 'Calendar',      title: 'Booking Confirmed', description: 'Security lights job scheduled for next week',   time: '2 days ago',  status: 'pending',   to: '/lucid/bookings' },
  ];
};

// ─── Notification + message badge counts (used across many pages) ───────────
// [API] GET /notifications/count?userId={id}&read=false
// [API] GET /messages/unread-count?userId={id}
// [API] GET /bookings/new-count?{role}Id={id}
export const getBadgeCounts = async () => {
  await sleep(150);
  return {
    notifications: 5,
    unreadMessages: 3,
    unreadBookings: 5,
  };
};

// ─── Earnings (provider only) ────────────────────────────────────────────────
// [API] GET /providers/:id/earnings?period={week|month|year}
export const getProviderEarnings = async () => {
  await sleep();
  return {
    thisWeek: 720,   lastWeek: 650,
    thisMonth: 2840, lastMonth: 2410,
    thisYear: 19200, lastYear: 14400,
    pending: 480,    available: 1240,
    weeklyData: [
      { label: 'Mon', value: 90 },
      { label: 'Tue', value: 140 },
      { label: 'Wed', value: 80 },
      { label: 'Thu', value: 110 },
      { label: 'Fri', value: 160 },
      { label: 'Sat', value: 100 },
      { label: 'Sun', value: 40 },
    ],
    monthlyData: [
      { label: 'Week 1', value: 620 },
      { label: 'Week 2', value: 740 },
      { label: 'Week 3', value: 760 },
      { label: 'Week 4', value: 720 },
    ],
    yearlyData: [
      { label: 'Jan', value: 1480 },
      { label: 'Feb', value: 1620 },
      { label: 'Mar', value: 1740 },
      { label: 'Apr', value: 1880 },
      { label: 'May', value: 2840 },
      { label: 'Jun', value: 0 },
      { label: 'Jul', value: 0 },
      { label: 'Aug', value: 0 },
      { label: 'Sep', value: 0 },
      { label: 'Oct', value: 0 },
      { label: 'Nov', value: 0 },
      { label: 'Dec', value: 0 },
    ],
    totalJobs: { thisWeek: 4, thisMonth: 18, thisYear: 47 },
    goals: { monthly: 3000, yearly: 25000 },
  };
};

// ─── Transactions (provider only) ────────────────────────────────────────────
const TRANSACTIONS = [
  { id: 't_001', date: '2026-05-26', description: 'Payment received from Akua Mensah', amount:  250, status: 'completed', method: 'MTN Mobile Money', jobType: 'Electrical Wiring Repair' },
  { id: 't_002', date: '2026-05-25', description: 'Payment received from Kofi Anane',  amount:  180, status: 'completed', method: 'Vodafone Cash',     jobType: 'Bathroom Plumbing' },
  { id: 't_003', date: '2026-05-24', description: 'Withdrawal to MTN Mobile Money',     amount: -500, status: 'completed', method: 'MTN Mobile Money', jobType: null },
  { id: 't_004', date: '2026-05-22', description: 'Payment received from Nana Adjei',   amount:  400, status: 'completed', method: 'MTN Mobile Money', jobType: 'AC Installation' },
  { id: 't_005', date: '2026-05-21', description: 'Payment received from Maame Yaa',    amount:  120, status: 'completed', method: 'Bank Transfer',    jobType: 'House Cleaning' },
  { id: 't_006', date: '2026-05-20', description: 'Withdrawal to GCB Bank',             amount: -800, status: 'pending',   method: 'Bank Transfer',    jobType: null },
  { id: 't_007', date: '2026-05-18', description: 'Payment received from Ama Boateng',  amount:  340, status: 'completed', method: 'MTN Mobile Money', jobType: 'Cabinet Installation' },
  { id: 't_008', date: '2026-05-15', description: 'Refund issued to Kojo Asante',       amount:  -90, status: 'completed', method: 'MTN Mobile Money', jobType: null },
  { id: 't_009', date: '2026-05-12', description: 'Payment failed — Yaa Nyarko',        amount:   75, status: 'failed',    method: 'Vodafone Cash',    jobType: 'Quick Plumbing' },
];

// [API] GET /providers/:id/transactions?page={n}&status={}&type={}
export const getProviderTransactions = async () => {
  await sleep();
  return TRANSACTIONS;
};

// ─── Payment methods ─────────────────────────────────────────────────────────
// [API] GET /users/:id/payment-methods
export const getPaymentMethods = async () => {
  await sleep(200);
  return [
    { id: 'pm_001', type: 'mobile-money', bankCode: 'MTN', name: 'MTN Mobile Money', number: '024 123 4567', isPrimary: true  },
    { id: 'pm_002', type: 'bank',         bankCode: 'GCB', name: 'GCB Bank',          number: '1234567890123', isPrimary: false },
  ];
};

// ─── Favourites (client only) ────────────────────────────────────────────────
// [API] GET /users/:id/favourites
export const getFavouriteProviders = async () => {
  await sleep();
  return [
    { id: 'pr_001', name: 'John Mensah',  role: 'Electrician', location: 'Spintex, Accra',      rating: 4.8, image: null },
    { id: 'pr_002', name: 'Yaw Boateng',  role: 'Plumber',     location: 'East Legon, Accra',   rating: 4.7, image: null },
    { id: 'pr_003', name: 'Samuel Owusu', role: 'AC Technician', location: 'Cantonments, Accra', rating: 4.9, image: null },
    { id: 'pr_004', name: 'Esi Asante',   role: 'Cleaner',     location: 'Osu, Accra',          rating: 4.6, image: null },
  ];
};
