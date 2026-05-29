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
// Nested shape matches the BookingCard / BookingDetailsModal / dashboard card
// contracts (provider/client/location objects + title/description/duration).
const BOOKINGS = [
  {
    id: 'bk_001',
    bookingReference: 'LUC-2026-0001',
    status: 'in-progress',
    title: 'Electrical Wiring Repair',
    serviceType: 'Electrical',
    description: 'Rewire the living room sockets and fix the faulty distribution board.',
    provider: { name: 'John Mensah' },
    providerId: 'pr_001',
    client: { name: 'Akua Mensah' },
    clientId: 'cl_001',
    location: { area: 'Spintex', city: 'Accra' },
    date: '2026-05-28',
    time: '10:00 AM',
    duration: '3 hours',
    price: 250,
    agreedPrice: 250,
    budget: 250,
    urgency: 'normal',
    paymentStatus: 'unpaid',
    bookingDate: '2026-05-24',
    rating: null,
  },
  {
    id: 'bk_002',
    bookingReference: 'LUC-2026-0002',
    status: 'confirmed',
    title: 'Bathroom Plumbing',
    serviceType: 'Plumbing',
    description: 'Replace the leaking shower mixer and install a new sink trap.',
    provider: { name: 'Yaw Boateng' },
    providerId: 'pr_002',
    client: { name: 'Kofi Anane' },
    clientId: 'cl_002',
    location: { area: 'East Legon', city: 'Accra' },
    date: '2026-05-30',
    time: '2:00 PM',
    duration: '2 hours',
    price: 180,
    agreedPrice: 180,
    budget: 200,
    urgency: 'normal',
    paymentStatus: 'unpaid',
    bookingDate: '2026-05-25',
    rating: null,
  },
  {
    id: 'bk_003',
    bookingReference: 'LUC-2026-0003',
    status: 'pending',
    title: 'AC Installation',
    serviceType: 'HVAC',
    description: 'Supply and install a 1.5HP split air-conditioner in the master bedroom.',
    provider: { name: 'Samuel Owusu' },
    providerId: 'pr_003',
    client: { name: 'Nana Adjei' },
    clientId: 'cl_003',
    location: { area: 'Cantonments', city: 'Accra' },
    date: '2026-06-02',
    time: '9:00 AM',
    duration: '4 hours',
    price: 400,
    agreedPrice: null,
    budget: 450,
    urgency: 'high',
    paymentStatus: 'unpaid',
    bookingDate: '2026-05-27',
    rating: null,
  },
  {
    id: 'bk_004',
    bookingReference: 'LUC-2026-0004',
    status: 'completed',
    title: 'House Cleaning',
    serviceType: 'Cleaning',
    description: 'Deep-clean a 3-bedroom apartment including the kitchen and balconies.',
    provider: { name: 'Esi Asante' },
    providerId: 'pr_004',
    client: { name: 'Maame Yaa' },
    clientId: 'cl_004',
    location: { area: 'Osu', city: 'Accra' },
    date: '2026-05-20',
    time: '8:00 AM',
    duration: '5 hours',
    price: 120,
    agreedPrice: 120,
    budget: 120,
    urgency: 'normal',
    paymentStatus: 'paid',
    bookingDate: '2026-05-16',
    rating: 5,
    review: 'Excellent work — spotless and very professional. Will book again!',
  },
  {
    id: 'bk_005',
    bookingReference: 'LUC-2026-0005',
    status: 'completed',
    title: 'Cabinet Installation',
    serviceType: 'Carpentry',
    description: 'Mount overhead kitchen cabinets and adjust hinges on the existing units.',
    provider: { name: 'Kwame Darko' },
    providerId: 'pr_005',
    client: { name: 'Ama Boateng' },
    clientId: 'cl_005',
    location: { area: 'Tema', city: 'Greater Accra' },
    date: '2026-05-18',
    time: '11:00 AM',
    duration: '6 hours',
    price: 340,
    agreedPrice: 340,
    budget: 350,
    urgency: 'normal',
    paymentStatus: 'paid',
    bookingDate: '2026-05-12',
    rating: 4,
    review: 'Good job overall — arrived a little late but the finish was clean.',
  },
  {
    id: 'bk_006',
    bookingReference: 'LUC-2026-0006',
    status: 'cancelled',
    title: 'Quick Plumbing Fix',
    serviceType: 'Plumbing',
    description: 'Unclog the kitchen drain and reseal the sink.',
    provider: { name: 'Yaw Boateng' },
    providerId: 'pr_002',
    client: { name: 'Yaa Nyarko' },
    clientId: 'cl_006',
    location: { area: 'Adenta', city: 'Accra' },
    date: '2026-05-15',
    time: '1:00 PM',
    duration: '1 hour',
    price: 75,
    agreedPrice: 75,
    budget: 80,
    urgency: 'normal',
    paymentStatus: 'refunded',
    bookingDate: '2026-05-13',
    cancellationReason: 'Client rescheduled and cancelled the original slot.',
    rating: null,
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

// ─── Earnings chart series (provider only) ───────────────────────────────────
// [API] GET /providers/:id/earnings/chart?period={week|month|year}
//   → { name, earnings, jobs }[] per bucket. EarningsChart reads weekly/monthly/yearly.
export const getEarningsChartData = async () => {
  await sleep();
  return {
    weekly: [
      { name: 'Mon', earnings: 90,  jobs: 1 },
      { name: 'Tue', earnings: 140, jobs: 2 },
      { name: 'Wed', earnings: 80,  jobs: 1 },
      { name: 'Thu', earnings: 110, jobs: 2 },
      { name: 'Fri', earnings: 160, jobs: 3 },
      { name: 'Sat', earnings: 100, jobs: 1 },
      { name: 'Sun', earnings: 40,  jobs: 1 },
    ],
    monthly: [
      { name: 'Week 1', earnings: 620, jobs: 4 },
      { name: 'Week 2', earnings: 740, jobs: 5 },
      { name: 'Week 3', earnings: 760, jobs: 5 },
      { name: 'Week 4', earnings: 720, jobs: 4 },
    ],
    yearly: [
      { name: 'Jan', earnings: 1480, jobs: 9  },
      { name: 'Feb', earnings: 1620, jobs: 10 },
      { name: 'Mar', earnings: 1740, jobs: 11 },
      { name: 'Apr', earnings: 1880, jobs: 12 },
      { name: 'May', earnings: 2840, jobs: 18 },
      { name: 'Jun', earnings: 0,    jobs: 0  },
      { name: 'Jul', earnings: 0,    jobs: 0  },
      { name: 'Aug', earnings: 0,    jobs: 0  },
      { name: 'Sep', earnings: 0,    jobs: 0  },
      { name: 'Oct', earnings: 0,    jobs: 0  },
      { name: 'Nov', earnings: 0,    jobs: 0  },
      { name: 'Dec', earnings: 0,    jobs: 0  },
    ],
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
