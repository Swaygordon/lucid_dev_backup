import React, { useState, useMemo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Hammer, House, Truck, Settings, ChevronRight } from 'lucide-react';
import { FaBroom } from 'react-icons/fa';
import BusinessCategorySection from '../components/suggested_category.jsx';
import { DownloadSection } from '../components/download_ad.jsx';

// Lazy load heavy components
const BackToTop = lazy(() => import('../components/back_the_top_btn'));

// Import ProfileCard directly (not lazy) since it's needed immediately
import ProfileCard from '../components/user_card';

// Image imports (these will be bundled)
import BackgroundImage from "../assets/roommates-cleaning.jpg";
import BackgroundImage1 from "../assets/143147.jpg";
import BackgroundImage2 from "../assets/delivery.jpg";
import BackgroundImage3 from "../assets/leftdown.jpg";
import BackgroundImage4 from "../assets/carpentry.jpg";
import homerepair from "../assets/cleaners.jpg";
import moving from "../assets/delivery.jpg";
import autorepair from "../assets/carmechanic.jpg";
import construction from "../assets/carpenterlady.jpg";



// ============================================
// ANIMATION VARIANTS
// ============================================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

// ============================================
// MEMOIZED COMPONENTS
// ============================================

// Hero Section Component
const HeroSection = React.memo(({ backgroundImage, icon: Icon, title, subtitle }) => (
  <div className='h-1/2'>
    <div
      className="hero w-full h-96"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="hero-overlay bg-black bg-opacity-40"></div>
      <motion.div 
        className="hero-content justify-start items-start w-full"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-3xl px-6 text-left">
          {/* Icon */}
          <motion.div 
            className="mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Icon size={46} className="text-white" />
          </motion.div>
          
          {/* Heading */}
          <motion.h1 
            className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4 drop-shadow-lg"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h1>
          <motion.p 
            className="text-white text-lg md:text-xl drop-shadow-md"
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        </div>
      </motion.div>
    </div>
  </div>
));

// Breadcrumb Component
const Breadcrumb = React.memo(({ items }) => (
  <motion.div 
    className="container my-4 mx-auto px-6 py-6"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="breadcrumbs text-sm">
      <ul className="flex items-center">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <Link 
              to={item.path} 
              className="text-black text-base font-semibold hover:text-blue-600 transition-colors"
            >
              {item.label}
            </Link>
            {index < items.length - 1 && (
              <ChevronRight className="w-5 h-5 mx-2 text-gray-400" />
            )}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
));


// Loading Skeleton for Profile Cards
const ProfileCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-3"></div>
    <div className="h-4 bg-gray-300 rounded mb-2"></div>
    <div className="h-3 bg-gray-300 rounded mb-2"></div>
    <div className="h-3 bg-gray-300 rounded mb-4"></div>
    <div className="h-8 bg-gray-300 rounded"></div>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const SERVICE_ICONS = [
  { id: 1, icon: House, name: 'Home repairs' },
  { id: 2, icon: Truck, name: 'Moving' },
  { id: 3, icon: Settings, name: 'Auto repairs' },
  { id: 4, icon: Hammer, name: 'Construction' }
];

  const BUSINESS_CARDS = {
    'Home repairs': {
      cat: 'Home repairs',
      mainCardBackground: BackgroundImage1,
      cardIcon: House,
      heading: 'Maintenance and painting business',
      seeAll: 'See all maintenance'
    },
    'Moving': {
      cat: 'Moving',
      mainCardBackground: BackgroundImage2,
      cardIcon: Truck,
      heading: 'Moving and relocation services',
      seeAll: 'See all moving services'
    },
    'Auto repairs': {
      cat: 'Auto repairs',
      mainCardBackground: BackgroundImage3,
      cardIcon: Settings,
      heading: 'Professional auto repair services',
      seeAll: 'See all auto services'
    },
    'Construction': {
      cat: 'Construction',
      mainCardBackground: BackgroundImage4,
      cardIcon: Hammer,
      heading: 'Construction and renovation',
      seeAll: 'See all construction services'
    }
  };
  
  const BUSINESS_SERVICES = [
    { cat: 'Home repairs', image: homerepair, title: 'House Cleaning', subtitle: 'See workers near you', icon: 'map.png' },
    { cat: 'Home repairs', image: homerepair, title: 'Handy Man', subtitle: 'See workers near you', icon: 'map.png' },
    { cat: 'Home repairs', image: homerepair, title: 'Interior painting', subtitle: 'See workers near you', icon: 'map.png' },
    { cat: 'Moving', image: moving, title: 'Packing Services', subtitle: 'See workers near you', icon: 'map.png' },
    { cat: 'Moving', image: moving, title: 'Furniture Moving', subtitle: 'See workers near you', icon: 'map.png' },
    { cat: 'Moving', image: moving, title: 'Storage Solutions', subtitle: 'See workers near you', icon: 'map.png' },
    { cat: 'Auto repairs', image: autorepair, title: 'Engine Repair', subtitle: 'See workers near you', icon: 'map.png' },
    { cat: 'Auto repairs', image: autorepair, title: 'Brake Service', subtitle: 'See workers near you', icon: 'map.png' },
    { cat: 'Auto repairs', image: autorepair, title: 'Oil Change', subtitle: 'See workers near you', icon: 'map.png' },
    { cat: 'Construction', image: construction, title: 'Building Construction', subtitle: 'See workers near you', icon: 'map.png' },
    { cat: 'Construction', image: construction, title: 'Renovation', subtitle: 'See workers near you', icon: 'map.png' },
    { cat: 'Construction', image: construction, title: 'Roofing', subtitle: 'See workers near you', icon: 'map.png' }
  ];
  

  

const SelectedService = () => {

const profiles = useMemo(() => [
    { name: "Sarah Johnson", role: "Cleaner", location: "East Legon, Accra", rating: 2.5, image: null },
    { name: "Michael Osei", role: "Cleaner", location: "Madina, Accra", rating: 2.0, image: null },
    { name: "Sarah Johnson", role: "Cleaner", location: "East Legon, Accra", rating: 4.5, image: null },
    { name: "Michael Osei", role: "Cleaner", location: "Madina, Accra", rating: 1.6, image: null },
    { name: "Sarah Johnson", role: "Cleaner", location: "East Legon, Accra", rating: 4.5, image: null },
    { name: "Michael Osei", role: "Cleaner", location: "Madina, Accra", rating: 5.0, image: null },
    { name: "Sarah Johnson", role: "Cleaner", location: "East Legon, Accra", rating: 4.5, image: null },
    { name: "Michael Osei", role: "Cleaner", location: "Madina, Accra", rating: 5.0, image: null },
    { name: "Sarah Johnson", role: "Cleaner", location: "East Legon, Accra", rating: 4.5, image: null },
    { name: "Michael Osei", role: "Cleaner", location: "Madina, Accra", rating: 4.2, image: null },
    { name: "Sarah Johnson", role: "Cleaner", location: "East Legon, Accra", rating: 2.6, image: null },
    { name: "Michael Osei", role: "Cleaner", location: "Madina, Accra", rating: 1.8, image: null },
    { name: "Sarah Johnson", role: "Cleaner", location: "East Legon, Accra", rating: 4.8, image: null },
    { name: "Michael Osei", role: "Cleaner", location: "Madina, Accra", rating: 2.7, image: null },
    { name: "Sarah Johnson", role: "Cleaner", location: "East Legon, Accra", rating: 4.5, image: null },
    { name: "Michael Osei", role: "Cleaner", location: "Madina, Accra", rating: 5.0, image: null },
  ], []);

  const breadcrumbItems = useMemo(() => [
    { label: 'Services', path: '/Service' },
    { label: 'Home', path: '/category' },
    { label: 'House Cleaning', path: '#' }
  ], []);

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Hero Section */}
      <HeroSection
        backgroundImage={BackgroundImage}
        icon={FaBroom}
        title="Trusted help, when and how you need it."
        subtitle="Connect with verified professionals for all your service needs"
      />

      {/* Breadcrumbs */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Profile Cards Section */}
      <div className="container mx-auto px-6 pb-16">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            House Cleaning Services Near You
          </h2>
          <p className="text-gray-600 text-lg">
            Choose the perfect service for you
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {profiles.map((profile, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              transition={{ duration: 0.3 }}
            >
              <ProfileCard 
                {...profile}
                onViewProfile={() => console.log('View profile:', profile.name)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Download Section */}
      <DownloadSection />

      {/* Business Category Section */}
              <motion.div 
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <BusinessCategorySection
                  serviceIcons={SERVICE_ICONS}
                  businessCards={BUSINESS_CARDS}
                  businessServices={BUSINESS_SERVICES}
                />
              </motion.div>

      {/* Back to Top Button */}
      <Suspense fallback={null}>
        <BackToTop />
      </Suspense>
    </div>
  );
};
export default SelectedService;