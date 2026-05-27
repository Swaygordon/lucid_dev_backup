// ─────────────────────────────────────────────────────────────────────────────
// Phase 6 mock data — Account overviews, Settings, Notifications
//
// REMOVE THIS FILE when Phase 6 backend integration lands. Pages importing
// from here should switch to real fetch calls against the endpoints listed in
// each function's [API] comment.
// ─────────────────────────────────────────────────────────────────────────────

const sleep = (ms = 250) => new Promise(r => setTimeout(r, ms));

// ─── Notifications ───────────────────────────────────────────────────────────
// [API] GET /notifications?userId={id}&page={n}  (sorted by createdAt desc)
// [WS] Subscribe to user notification channel on 'notification:new'
export const getNotifications = async () => {
  await sleep();
  return [
    { id: 1, type: 'payment',  status: 'success', title: 'Payment Successful!',  message: 'Thank you for your purchase! A confirmation email has been sent to your address.', time: '10 min', read: false, date: 'Today',            category: 'payment',  bookmarked: false, loc: '#' },
    { id: 2, type: 'payment',  status: 'error',   title: 'Payment Failed!',      message: 'Your payment could not be processed. Please check your payment details and try again.', time: '25 min', read: false, date: 'Today',           category: 'payment',  bookmarked: false, loc: '#' },
    { id: 3, type: 'profile',  status: 'success', title: 'Profile Updated!',     message: 'Your profile information has been successfully updated.', time: '1 hr',  read: false, date: 'Today',                                                                       category: 'bookmark', bookmarked: true,  loc: '#' },
    { id: 4, type: 'message',  status: 'info',    title: 'New Message',          message: 'You have a new message from your Client.', time: '2 hrs', read: true,  date: 'Yesterday',                                                                                 category: 'read',     bookmarked: false, loc: '/lucid/messages' },
    { id: 5, type: 'payment',  status: 'error',   title: 'Payment Failed!',      message: 'Your payment could not be processed. Please check your payment details and try again.', time: '1 day', read: true,   date: 'Yesterday',                                  category: 'payment',  bookmarked: false, loc: '#' },
    { id: 6, type: 'message',  status: 'info',    title: 'New Message',          message: 'You have a new message from your Client.', time: '3 days', read: true,  date: 'October 21, 2025',                                                                         category: 'read',     bookmarked: false, loc: '/lucid/messages' },
    { id: 7, type: 'message',  status: 'info',    title: 'New Message',          message: 'You have a new message from your Client.', time: '4 days', read: true,  date: 'October 20, 2025',                                                                         category: 'bookmark', bookmarked: true,  loc: '/lucid/messages' },
    { id: 8, type: 'message',  status: 'info',    title: 'New Message',          message: 'You have a new message from your Client.', time: '4 days', read: false, date: 'October 20, 2025',                                                                         category: 'bookmark', bookmarked: true,  loc: '/lucid/messages' },
  ];
};

// ─── Notification preferences ────────────────────────────────────────────────
// [API] GET /users/:id/notification-settings
export const getNotificationSettings = async () => {
  await sleep(200);
  return {
    push: {
      bookingUpdates: true,
      newMessages:    true,
      paymentAlerts:  true,
      reviews:        true,
      promotions:     false,
    },
    email: {
      bookingUpdates: true,
      newMessages:    false,
      paymentAlerts:  true,
      reviews:        true,
      promotions:     false,
      weeklyDigest:   true,
    },
    sms: {
      bookingUpdates: true,
      paymentAlerts:  true,
      criticalAlerts: true,
    },
  };
};

// ─── Account summary stats (Account Overview pages) ──────────────────────────
// [API] GET /users/:id/overview
export const getClientAccountOverview = async () => {
  await sleep();
  return {
    completedJobs: 14,
    activeBookings: 2,
    memberSince: '2025-08-12',
  };
};

export const getProviderAccountOverview = async () => {
  await sleep();
  return {
    completedJobs: 47,
    activeBookings: 3,
    memberSince: '2025-04-22',
  };
};

// ─── Personal info (user_info / settings page) ───────────────────────────────
// [API] GET /users/:id/profile
export const getUserInfo = async () => {
  await sleep();
  return {
    firstName:  'Akua',
    lastName:   'Mensah',
    email:      'akua.mensah@example.com',
    phone:      '024 123 4567',
    address:    'No. 12 Spintex Road',
    city:       'Accra',
    dateOfBirth:'1995-06-14',
  };
};
