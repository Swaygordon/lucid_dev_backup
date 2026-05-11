import React, { useState, useMemo, useEffect } from 'react';
import ServicesMap from '../components/ServicesMap.jsx';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigateBack } from '../hooks/useNavigateBack.js';
import { useNotification } from '../contexts/NotificationContext';
import { Avatar, StatCard } from '../components/ui';
import { BookingDetailsModal, CancelBookingModal } from '../components/shared';
// [MOCK] getBookingsByClient and calculateBookingStats read from local mock data.
// Replace with: GET /bookings?clientId={id}&status=pending,confirmed,in-progress
// and GET /users/:id/stats  (or compute stats from the bookings response).
import { getBookingsByClient, calculateBookingStats } from '../data/mockDataUtils';
import { CURRENT_CLIENT_ID } from '../data/mockCurrentUser';
import { supabase } from '../lib/supabaseClient';
// [MOCK] mockProviders will be replaced by: GET /providers/nearby?lat={lat}&lng={lng}&radius=5
import { mockProviders } from '../data/mockProfiles.js';
import {
  ArrowLeft, Search, Calendar, DollarSign, Star, Clock, CheckCircle,
  Heart, MapPin, MessageSquare, Bell, ChevronRight, Filter, User
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

// Mini booking card used only on the dashboard — full booking actions live in client_bookings
const DashboardBookingCard = ({ booking, onViewDetails }) => {
  const providerName = booking.provider?.name ?? 'Service Provider';
  const locationLabel = [booking.location?.area, booking.location?.city]
    .filter(Boolean).join(', ');

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-primary/30 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar name={providerName} size="md" />
          <div>
            <h4 className="font-semibold text-gray-900">{providerName}</h4>
            <p className="text-sm text-gray-600">{booking.title}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-primary-50 text-primary text-xs font-semibold rounded-full capitalize">
          {booking.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{booking.date} at {booking.time}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{locationLabel}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-lg font-bold text-gray-900">GH₵{booking.price}</span>
        <button
          onClick={() => onViewDetails(booking)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-semibold"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

const ProviderCard = ({ name, profession, rating, jobs, isFavorite }) => {
  const [favorite, setFavorite] = useState(isFavorite);

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all relative"
    >
      <button
        onClick={() => setFavorite(!favorite)}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Heart className={`w-5 h-5 ${favorite ? 'fill-error text-error' : 'text-gray-400'}`} />
      </button>

      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-light to-purple-600 flex items-center justify-center text-white font-bold text-xl mb-3">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <h3 className="font-bold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{profession}</p>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="font-semibold text-gray-900">{rating}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">{jobs} jobs</span>
        </div>
      </div>

      <Link to="/lucid/providers/me">
        <button className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-semibold">
          View Profile
        </button>
      </Link>
    </motion.div>
  );
};

const QuickAction = ({ icon: Icon, label, to, badgeCount }) => (
  <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
    <Link
      to={to}
      className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow"
    >
      <div className="p-4 bg-gradient-to-br from-primary-light to-primary rounded-xl relative">
        <Icon className="w-6 h-6 text-white" />
        {badgeCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-5 h-5 bg-error rounded-full flex items-center justify-center text-xs text-white font-bold px-1 border-2 border-white">
            {badgeCount > 99 ? '99+' : badgeCount}
          </span>
        )}
      </div>
      <span className="text-sm font-semibold text-gray-900">{label}</span>
    </Link>
  </motion.div>
);

const ActivityItem = ({ icon: Icon, title, description, time, actionLabel, to }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ x: 5 }}
    className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
  >
    <Link to={to} className="flex gap-4 flex-1">
      <div className="w-9 h-9 p-2 bg-primary-50 rounded-lg">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {time}
          </p>
          {actionLabel && (
            <button className="text-xs text-primary font-semibold hover:text-primary-hover">
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </Link>
  </motion.div>
);

const ClientDashboard = () => {
  const [currentUserName, setCurrentUserName] = useState('there');
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      supabase.from('profiles').select('first_name, last_name').eq('id', session.user.id).single()
        .then(({ data }) => {
          if (data) {
            const name = [data.first_name, data.last_name].filter(Boolean).join(' ');
            if (name) setCurrentUserName(name);
          }
        });
    });
  }, []);

  const [timeframe, setTimeframe] = useState('month');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  // [API] GET /notifications/count?userId={id}&read=false → { count: number }
  // [WS] Subscribe to 'notification' events on the user's WebSocket channel to update in real time.
  const [notificationCount, setNotificationCount] = useState(5);
  // [API] GET /messages/unread-count?userId={id} → { count: number }
  const [unreadMessages] = useState(3);
  // [API] GET /bookings/new-count?clientId={id} — bookings not yet viewed by client
  const [unreadBookings] = useState(5);

  const handleBackClick = useNavigateBack('/lucid/', 600);
  const { showNotification } = useNotification();

  const handleCancel = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
    setSelectedBooking(null);
  };

  const confirmCancel = async (booking) => {
    // [API] POST /bookings/:id/cancel  { reason: 'Client requested', requestedBy: 'client' }
    // On success: refetch allBookings or remove the cancelled booking from local state.
    showNotification('Booking cancelled successfully', 'success');
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  const handleEdit = () => {
    showNotification('Edit feature coming soon', 'info');
    setSelectedBooking(null);
  };

  const allBookings = useMemo(() => getBookingsByClient(CURRENT_CLIENT_ID), []);
  const bookingStats = useMemo(() => calculateBookingStats(allBookings), [allBookings]);

  const activeBookings = useMemo(() =>
    allBookings.filter(b => ['pending', 'confirmed', 'in-progress'].includes(b.status)),
    [allBookings]
  );

  // [API] Stats (change %, trend) should come from: GET /users/:id/stats?period={timeframe}
  // → { activeBookings, completedJobs, totalSpent, favouritesCount, weekOverWeekChange: {...} }
  // 'Favourites: 8' and all change values are hardcoded placeholders below.
  const stats = useMemo(() => [
    { icon: Calendar, title: 'Active Bookings', value: bookingStats.active.toString(), change: '+1', trend: 'up', color: 'blue' },
    { icon: CheckCircle, title: 'Completed Jobs', value: bookingStats.completed.toString(), change: '+3', trend: 'up', color: 'green' },
    { icon: DollarSign, title: 'Total Spent', value: `GH₵${bookingStats.totalRevenue}`, change: '+15%', trend: 'up', color: 'purple' },
    // [API] GET /users/:id/favourites/count → { count: number }
    { icon: Heart, title: 'Favourites', value: '8', change: '+2', trend: 'up', color: 'orange' }
  ], [bookingStats]);

  const bookings = useMemo(() => activeBookings.slice(0, 3), [activeBookings]);

  // [MOCK] Replace with: GET /activity-feed?userId={id}&limit=4
  // → [{ type: 'booking_completed'|'new_message'|'booking_confirmed'|'review_posted',
  //       title, description, timestamp, relatedId, relatedRoute }]
  // The `time` field should use a relative-time formatter (e.g. date-fns formatDistanceToNow).
  const recentActivities = [
    { icon: CheckCircle, title: 'Service Completed', description: 'Plumbing repair at Osu completed successfully', time: '2 hours ago', actionLabel: 'Leave Review', to: '/lucid/bookings' },
    { icon: MessageSquare, title: 'New Message', description: 'Gabriel replied to your inquiry', time: '4 hours ago', actionLabel: 'View Message', to: '/lucid/messages' },
    { icon: Calendar, title: 'Booking Confirmed', description: 'Electrical installation scheduled for tomorrow', time: '1 day ago', actionLabel: null, to: '/lucid/bookings' },
    { icon: Star, title: 'Review Posted', description: 'Your review for John Mensah has been published', time: '2 days ago', actionLabel: null, to: '/lucid/providers/me' }
  ];

  const quickActions = [
    { icon: Search, label: 'Find Services', to: '/lucid/services' },
    { icon: Calendar, label: 'My Bookings', to: '/lucid/bookings', badgeCount: unreadBookings },
    { icon: User, label: 'Account', to: '/lucid/account' },
    { icon: MessageSquare, label: 'Messages', to: '/lucid/messages', badgeCount: unreadMessages }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm sticky top-0 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button onClick={handleBackClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl text-center font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-center mt-1">Welcome back, {currentUserName}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/lucid/notifications" onClick={() => setNotificationCount(0)}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-error rounded-full flex items-center justify-center text-xs text-white font-bold px-1 border-2 border-white">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </motion.button>
              </Link>
              <Link to="/lucid/account">
                <Avatar name={currentUserName} size="md" />
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
          <section>
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-auto text-gray-700 bg-white px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
            </div>
          </section>

          <section>
            <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-6">
              Quick Actions
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, i) => <QuickAction key={i} {...action} />)}
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2">
              <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Active Bookings</h2>
                <Link to="/lucid/bookings" className="flex items-center gap-2 text-primary hover:text-primary-hover font-semibold">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <DashboardBookingCard key={booking.id} booking={booking} onViewDetails={setSelectedBooking} />
                ))}
              </div>
            </section>

            <section>
              <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              </motion.div>
              <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md divide-y divide-gray-100">
                {recentActivities.map((activity, i) => (
                  <ActivityItem key={i} {...activity} />
                ))}
              </motion.div>
            </section>
          </div>

          <motion.section variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Services Near You</h2>
                  <p className="text-gray-600 mt-1">Showing providers within 5km radius</p>
                </div>
                <button className="px-4 py-2 text-primary hover:bg-primary-50 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
              {/* [API] GET /providers/nearby?lat={userLat}&lng={userLng}&radius=5
                   Requires browser Geolocation API (navigator.geolocation.getCurrentPosition).
                   The ServicesMap component will need real lat/lng coords, not mock provider objects. */}
              <ServicesMap providers={mockProviders} />
            </div>
          </motion.section>
        </motion.div>
      </main>

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          userType="client"
          onCancel={handleCancel}
          onEdit={handleEdit}
        />
      )}

      <CancelBookingModal
        booking={bookingToCancel}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={confirmCancel}
      />
    </div>
  );
};

export default ClientDashboard;
