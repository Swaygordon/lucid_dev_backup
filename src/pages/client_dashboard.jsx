import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../components/ui/Avatar.jsx';
import {
    ArrowLeft,
  Search,
  Calendar,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  Heart,
  MapPin,
  MessageSquare,
  Bell,
  ChevronRight,
  TrendingUp,
  Filter,
  Package,
  AlertCircle,
  X,
  User,
  Phone,
  Mail,
  FileText,
  Navigation,
   Edit2,
  Trash2,
  MessageCircle
} from 'lucide-react';


// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, change, trend, color }) => {
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const bgColor = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600'
  }[color];

  return (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      initial="rest"
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
            <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
            {change}
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </motion.div>
  );
};

// Active Booking Card
const BookingCard = ({ booking, onViewDetails }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar name={booking.client} size="md" />
          <div>
            <h4 className="font-semibold text-gray-900">{booking.client}</h4>
            <p className="text-sm text-gray-600">{booking.service}</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
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
          <span>{booking.location}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-lg font-bold text-gray-900">GH₵{booking.price}</span>
        <button 
          onClick={() => onViewDetails(booking)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
};

// Task Details Modal
const BookingDetailsModal = ({ booking, onClose, onCancel }) => {

  const { showNotification } = useNotification();
  
  if (!booking) return null;

  const getStatusConfig = (status) => {
    const configs = {
      Pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending' },
      Confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle, label: 'Confirmed' },
      Completed: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Completed' },
      Cancelled: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Cancelled' }
    };
    return configs[status] || configs.Pending;

  };

  const getUrgencyConfig = (urgency) => {
    const configs = {
      normal: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Normal' },
      urgent: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Urgent' },
      emergency: { bg: 'bg-red-100', text: 'text-red-700', label: 'Emergency' }
    };
    return configs[urgency] || configs.normal;
  };


  const statusConfig = getStatusConfig(booking.status);
  const urgencyConfig = getUrgencyConfig(booking.urgency);
  const StatusIcon = statusConfig.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{booking.service}</h2>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${urgencyConfig.bg} ${urgencyConfig.text}`}>
                  {urgencyConfig.label}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Client Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Client Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-semibold text-gray-900">{booking.client}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <a href={`tel:${booking.contactPhone}`} className="font-semibold text-blue-600 hover:underline flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {booking.contactPhone}
                  </a>
                </div>
                {booking.contactEmail && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <a href={`mailto:${booking.contactEmail}`} className="font-semibold text-blue-600 hover:underline flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {booking.contactEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Job Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{booking.description}</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estimated Duration</p>
                    <p className="font-semibold text-gray-900">{booking.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Budget Range</p>
                    <p className="font-semibold text-gray-900">
                      GH₵{booking.budgetMin} - GH₵{booking.budgetMax}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Quoted Price</p>
                    <p className="font-semibold text-green-600 text-lg">GH₵{booking.price}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Schedule
              </h3>
              <div className="grid md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Preferred Date & Time</p>
                  <p className="font-semibold text-gray-900">{booking.date} at {booking.time}</p>
                </div>
                {booking.alternateDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Alternate Date & Time</p>
                    <p className="font-semibold text-gray-900">{booking.alternateDate} at {booking.alternateTime}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Location
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="font-semibold text-gray-900">{booking.address}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Area</p>
                    <p className="font-semibold text-gray-900">{booking.location}</p>
                  </div>
                  {booking.landmark && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Landmark</p>
                      <p className="font-semibold text-gray-900">{booking.landmark}</p>
                    </div>
                  )}
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address + ', ' + booking.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <Navigation className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Additional Notes */}
            {booking.additionalNotes && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Notes</h3>
                <p className="text-gray-900 bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                  {booking.additionalNotes}
                </p>
              </div>
            )}
          </div>

          {/* Modal Footer - Action Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            {booking.status === 'Pending' && (
              <div className="flex gap-4">
                 <button className="flex-1 px-4 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold flex items-center justify-center gap-2">
                    <Edit2 className="w-5 h-5" />
                    Edit Booking
                  </button>
                  <button 
                    onClick={() => onCancel(booking)
}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Cancel Booking
                  </button>
              </div>
            )}
            {booking.status === 'Confirmed' && (
              <div className="flex gap-4">
                <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    Message Provider
                                  </button>
                                  <button 
                                    onClick={() =>onCancel(booking)
}
                                    className="px-6 py-3 bg-white border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold flex items-center gap-2"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                    Cancel
                                  </button>
              </div>
            )}
            {booking.status === 'Completed' && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold text-lg">Job Completed</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

//booking cancellation modal
const CancelModal = ({ booking, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full">
      <h3 className="text-lg text-red-600 font-bold mb-4">Cancel Booking?</h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to cancel <b>{booking.service}</b>?
      </p>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-red-600 border rounded-lg"
        >
          No
        </button>
        <button
          onClick={() => onConfirm(booking)}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);


// Service Provider Card
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
        <Heart className={`w-5 h-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
      </button>
      
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mb-3">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <h3 className="font-bold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{profession}</p>
        
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span className="font-semibold text-gray-900">{rating}</span>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">{jobs} jobs</span>
        </div>
      </div>
      
      <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
        View Profile
      </button>
    </motion.div>
  );
};

// Quick Action Button
const QuickAction = ({ icon: Icon, label, to, badgeCount }) => {
    
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to={to}
        className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow"
      >
        <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl relative">
    <Icon className="w-6 h-6 text-white" />
    {badgeCount > 0 && (
      <span className="absolute -top-2 -right-2 min-w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold px-1 border-2 border-white">
        {badgeCount > 99 ? '99+' : badgeCount}
      </span>
    )}
  </div>
        <span className="text-sm font-semibold text-gray-900">{label}</span>
      </Link>
    </motion.div>
  );
};


// Recent Activity Item
const ActivityItem = ({ icon: Icon, title, description, time, actionLabel, to }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 5 }}
      className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors"
    >
        <Link to={to}>
      <div className="w-9 p-2 bg-blue-50 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600" />
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
            <button className="text-xs text-blue-600 font-semibold hover:text-blue-700">
              {actionLabel}
            </button>
          )}
        </div>
      </div>
      </Link>
    </motion.div>
  );
};

// Main Client Dashboard Component
const ClientDashboard = () => {
  const [timeframe, setTimeframe] = useState('month');
  const [selectedBooking, setSelectedBooking] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(null);
     const handleCancelBooking = (booking) => {
  console.log('Cancelling booking:', booking.id);
  setShowCancelModal(null);
  setSelectedBooking(null);
};

const navigate = useNavigate();
  const { showNotification } = useNotification();
  const handleBackClick = useCallback(() => {
      showNotification('Going Back', 'info');
      setTimeout(() => {
        if (window.history.length > 2) {
          navigate(-1);
        } else {
          navigate('/lucid_website_test');
        }
      }, 600);
    }, [showNotification, navigate]);

const [notificationCount, setNotificationCount] = useState(5);
const [unreadMessages, setUnreadMessages] = useState(3);




  // Mock data
  const stats = useMemo(() => [
    { icon: Calendar, title: 'Active Bookings', value: '3', change: '+1', trend: 'up', color: 'blue' },
    { icon: CheckCircle, title: 'Completed Jobs', value: '12', change: '+3', trend: 'up', color: 'green' },
    { icon: DollarSign, title: 'Total Spent', value: 'GH₵2,340', change: '+15%', trend: 'up', color: 'purple' },
    { icon: Heart, title: 'Favorites', value: '8', change: '+2', trend: 'up', color: 'orange' }
  ], []);

  const activeBookings = useMemo(() => [
      {
        id: 1,
        client: 'John Mensah',
        service: 'Plumbing Repair',
        date: 'Dec 20, 2025',
        time: '10:00 AM',
        location: 'Spintex, Accra',
        price: '250',
        status: 'Confirmed',
        description: 'Fix leaking kitchen sink that has been dripping for 2 weeks.',
        duration: '2-3 hours',
        urgency: 'normal',
        contactPhone: '+233 24 123 4567',
        contactEmail: 'john.mensah@email.com',
        address: '123 Main Street, House 45',
        landmark: 'Near Total Gas Station',
        budgetMin: 200,
        budgetMax: 300,
        alternateDate: 'Dec 21, 2025',
        alternateTime: '2:00 PM',
        additionalNotes: 'Please bring all necessary tools.'
      },
      {
        id: 2,
        client: 'Grace Osei',
        service: 'Electrical Installation',
        date: 'Dec 21, 2025',
        time: '2:00 PM',
        location: 'North Ridge, Accra',
        price: '450',
        status: 'Confirmed',
        description: 'Install new ceiling fan and lights in living room and bedroom',
        duration: '4-5 hours',
        urgency: 'normal',
        contactPhone: '+233 20 987 6543',
        contactEmail: 'grace.osei@email.com',
        address: '456 Oak Avenue, Apartment 2B',
        landmark: 'Behind Ridge Hospital',
        budgetMin: 400,
        budgetMax: 500,
        additionalNotes: 'Fan and lights already purchased.'
      },
      {
        id: 3,
        client: 'Kwame Asante',
        service: 'Carpentry Work',
        date: 'Dec 22, 2025',
        time: '9:00 AM',
        location: 'Madina, Accra',
        price: '380',
        status: 'Pending',
        description: 'Build custom bookshelf with 5 shelves',
        duration: '1 day',
        urgency: 'normal',
        contactPhone: '+233 27 555 1234',
        contactEmail: 'kwame.asante@email.com',
        address: '789 Elm Street',
        landmark: 'Near Madina Market',
        budgetMin: 350,
        budgetMax: 400,
        additionalNotes: 'Wood specifications: Oak, dark finish.'
      }
    ], []);

  const recommendedProviders = useMemo(() => [
    { name: 'Sarah Johnson', profession: 'Interior Designer', rating: 4.9, jobs: 156, isFavorite: true },
    { name: 'Kwame Asante', profession: 'Carpenter', rating: 4.8, jobs: 203, isFavorite: false },
    { name: 'Ama Frimpong', profession: 'Painter', rating: 4.7, jobs: 89, isFavorite: true },
    { name: 'Peter Mensah', profession: 'Landscaper', rating: 4.9, jobs: 134, isFavorite: false }
  ], []);

  const recentActivities = useMemo(() => [
    {
      icon: CheckCircle,
      title: 'Service Completed',
      description: 'Plumbing repair at Osu completed successfully',
      time: '2 hours ago',
      actionLabel: 'Leave Review',
      to:'/client_bookings'
    },
    {
      icon: MessageSquare,
      title: 'New Message',
      description: 'Gabriel replied to your inquiry',
      time: '4 hours ago',
      actionLabel: 'View Message',
      to:'/allmessages'
    },
    {
      icon: Calendar,
      title: 'Booking Confirmed',
      description: 'Electrical installation scheduled for tomorrow',
      time: '1 day ago',
      actionLabel: null,
      to:'/client_bookings'
    },
    {
      icon: Star,
      title: 'Review Posted',
      description: 'Your review for John Mensah has been published',
      time: '2 days ago',
      actionLabel: null,
      to:'/generalProfile'
    }
  ], []);

  const quickActions = [
    { icon: Search, label: 'Find Services', to: "/Service" },
    { icon: Calendar, label: 'My Bookings', to:"/client_bookings" },
    { icon: User, label: 'Account', to: "/account" },
    {  icon: MessageSquare, label: 'Messages', to: "/allmessages", badgeCount: unreadMessages }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm sticky top-0 z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
                                      onClick={handleBackClick}
                                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                      <ArrowLeft className="w-6 h-6 text-gray-700" />
                                    </button>
            <div>
              <h1 className="text-3xl text-center font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-center mt-1">Welcome back, Gabriel!</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/notification" onClick={() => setNotificationCount(0)}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-700" />
{notificationCount > 0 && (
  <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-xs text-white font-bold px-1">
    {notificationCount > 99 ? '99+' : notificationCount}
  </span>
)}
              </motion.button>
              </Link>
              <Avatar name='Gabriel Gordon-Mensah' size='md'/>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Stats Grid */}
          <section>
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
              <select 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-auto text-gray-700 bg-white px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </section>

          {/* Quick Actions */}
                    <section>
                      <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900 mb-6">
                        Quick Actions
                      </motion.h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                          <QuickAction key={index} {...action} />
                        ))}
                      </div>
                    </section>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Active Bookings */}
            <section className="lg:col-span-2">
                          <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Active Bookings</h2>
                            <Link to='/client_bookings' className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                              View All
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          </motion.div>
                          
                          <div className="space-y-4">
                            {activeBookings.map((booking) => (
                              <BookingCard 
                                key={booking.id} 
                                booking={booking}
                                onViewDetails={setSelectedBooking}
                              />
                            ))}
                          </div>
                        </section>

            {/* Recent Activity */}
            <section>
              <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-xl shadow-md divide-y divide-gray-100"
              >
                {recentActivities.map((activity, index) => (
                  <ActivityItem key={index} {...activity} />
                ))}
              </motion.div>

              {/* Promo Card */}
              <motion.div
                variants={itemVariants}
                className="mt-6 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl p-6 text-white"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Package className="w-8 h-8" />
                  <h3 className="text-xl font-bold">Special Offer!</h3>
                </div>
                <p className="text-orange-50 mb-4">
                  Get 20% off your next booking with verified professionals
                </p>
                <button className="w-full py-2 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                  Claim Offer
                </button>
              </motion.div>
            </section>
          </div>

          {/* Recommended Service Providers */}
          <section>
            <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProviders.map((provider, index) => (
                <ProviderCard key={index} {...provider} />
              ))}
            </div>
          </section>

          {/* Services Near You */}
          <motion.section variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Services Near You</h2>
                  <p className="text-gray-600 mt-1">Based on your location in Accra</p>
                </div>
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
              
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Map view of nearby services</p>
                  <p className="text-sm text-gray-500 mt-2">Showing providers within 5km radius</p>
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>
      {/* Booking Details Modal */}
      <AnimatePresence>
  {selectedBooking && (
    <BookingDetailsModal
  booking={selectedBooking}
  onClose={() => setSelectedBooking(null)}
  onCancel={(booking) => setShowCancelModal(booking)}
/>


  )}
</AnimatePresence>
{/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <CancelModal
          booking={showCancelModal}
          onClose={() => setShowCancelModal(null)}
          onConfirm={handleCancelBooking}
        />
      )}

    </div>
  );
};

export default ClientDashboard;