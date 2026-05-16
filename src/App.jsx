// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — Root of the Lucid application
//
// Responsibilities:
//   1. Wrap the whole app in NotificationProvider (global toast/alert system)
//   2. Set up React Router with a shared Layout (Navbar + Footer)
//   3. Declare every route and protect authenticated-only routes
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';

// Leaflet CSS — must be imported globally so the map tiles render correctly.
// Without this, ServicesMap (client dashboard) shows broken tiles.
import 'leaflet/dist/leaflet.css';

// React Router — BrowserRouter uses the HTML5 history API (clean URLs, no #hash).
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Global notification system — wraps the whole app so any page can call
// useNotification() to show toast messages without prop drilling.
import { NotificationProvider } from './contexts/NotificationContext';
import { LocationProvider } from './contexts/LocationContext';

// Supabase client — used here only in ProtectedRoute to check the session.
// Pages import it directly from this same file when they need auth operations.
import { supabase } from './lib/supabaseClient';

// ─── Shared layout components ─────────────────────────────────────────────────
// Shown on every PUBLIC page. Hidden on dashboard/account/booking pages (see Layout).
import Navbar from "./components/navbar";
import Footer from './components/footer';

// ─── Public pages (no login needed) ──────────────────────────────────────────
import Home from './pages/home.jsx';                    // /lucid/
import About from './pages/about.jsx';                  // /lucid/about
import HelpSupport from './pages/help_support.jsx';     // /lucid/help
import Signup from './pages/sign_up.jsx';               // /lucid/signup  +  /lucid/become-provider
import Signin from './pages/sign_in.jsx';               // /lucid/signin

// ─── Services discovery flow (Phase 2) ───────────────────────────────────────
// All public. No login required to browse.
import Service from './pages/Services.jsx';             // /lucid/services  +  /lucid/search
import AllCategories from './pages/AllCategories.jsx';  // /lucid/services/all
import Category from './pages/category.jsx';            // /lucid/services/:category
import Selected_service from './pages/selected_service.jsx'; // /lucid/services/:category/:service

// ─── Provider profile flow (Phase 3) ─────────────────────────────────────────
import GeneralProfile from './pages/general_profilePage.jsx';           // /lucid/providers/:id  (public — client view)
import UserProfile from './pages/user_Profile.jsx';                     // /lucid/account/profile  (private — provider's own view)
import EditProfile from './pages/edit.jsx';                             // /lucid/account/profile/edit
import ProviderProfileSetup from './pages/provider_profile_setup.jsx';  // /lucid/account/profile/setup  (post-signup onboarding)
import ProfileSetupBanner from './components/ProfileSetupBanner.jsx';   // sitewide incomplete-profile nudge

// ─── Bookings flow (Phase 4) ──────────────────────────────────────────────────
// BookingsPage and BookingHistoryPage are thin wrappers: they call useRole()
// and render either the client or provider child component.
import ClientBookings from './pages/client_bookings.jsx';     // rendered inside BookingsPage
import ProviderBookings from './pages/provider_bookings.jsx'; // rendered inside BookingsPage
import BookingsPage from './pages/BookingsPage.jsx';          // /lucid/bookings  (role-switcher)
import ClientHistory from './pages/client_history.jsx';       // rendered inside BookingHistoryPage
import ProviderHistory from './pages/provider_history.jsx';   // rendered inside BookingHistoryPage
import BookingHistoryPage from './pages/BookingHistoryPage.jsx'; // /lucid/bookings/history  (role-switcher)
import BookingRequest from './pages/booking_request.jsx';     // /lucid/bookings/new
import BookingConfirmation from './pages/booking_confirmation.jsx'; // /lucid/bookings/confirmation

// ─── Dashboard flow (Phase 5) ─────────────────────────────────────────────────
// DashboardPage is a role-switcher: renders ClientDashboard or ProviderDashboard.
import ClientDashboard from './pages/client_dashboard.jsx';     // rendered inside DashboardPage
import ProviderDashboard from './pages/provider_dashboard.jsx'; // rendered inside DashboardPage
import DashboardPage from './pages/DashboardPage.jsx';          // /lucid/dashboard  (role-switcher)
import EarningsPayments from './pages/earnings.jsx';            // /lucid/earnings  (provider only)

// ─── Account & settings flow (Phase 6) ───────────────────────────────────────
// AccountPage is a role-switcher: renders ClientAccountOverview or ProviderAccountOverview.
import ClientAccountOverview from './pages/client_account_overview.jsx';     // rendered inside AccountPage
import ProviderAccountOverview from './pages/provider_account_overview.jsx'; // rendered inside AccountPage
import AccountPage from './pages/AccountPage.jsx';                           // /lucid/account  (role-switcher)
import UserInfo from './pages/user_info.jsx';                                // /lucid/account/settings
import AccountSettings from './pages/user_info.jsx';                          // /lucid/account/settings
import NotificationsPage from './pages/notification_page.jsx';               // /lucid/notifications
import NotificationSettings from './pages/notificationSettings.jsx';         // /lucid/notifications/settings

// ─── Messaging flow (Phase 7) ─────────────────────────────────────────────────
import MessagesListPage from './pages/messagelist.jsx';   // /lucid/messages
import ChatMessagingPage from './pages/messaging.jsx';    // /lucid/messages/:id


// ─────────────────────────────────────────────────────────────────────────────
// ProtectedRoute
//
// Wrap any <Route> element with this to require authentication.
// Optionally pass allowedRoles={['service_provider']} to also enforce role.
//
// Flow:
//   1. On mount, asks Supabase for the current session.
//   2. No session  → redirect to /lucid/signin
//   3. Session + no role requirement → render children
//   4. Session + role requirement → fetch role from profiles table
//        Role matches → render children
//        Role mismatch → redirect to /lucid/ (home)
//   5. While checking → render nothing (null) to avoid flash of wrong content
// ─────────────────────────────────────────────────────────────────────────────
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Status drives what gets rendered. Starts as 'loading' to block render
  // until the async session check resolves.
  const [status, setStatus] = useState('loading'); // 'loading' | 'allowed' | 'redirect-signin' | 'redirect-home'
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      // Step 1: check if there is an active Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setStatus('redirect-signin'); return; }

      // Step 2: if no role restriction, allow any authenticated user through
      if (allowedRoles.length === 0) { setStatus('allowed'); return; }

      // Step 3: role check — fetch the user's role from the profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')           // only fetch the role column, not the whole row
        .eq('id', session.user.id)
        .single();

      if (profile && allowedRoles.includes(profile.role)) {
        setStatus('allowed');
      } else {
        setStatus('redirect-home'); // authenticated but wrong role
      }
    };
    check();
  }, []); // runs once on mount — re-run not needed since navigation remounts the route

  if (status === 'loading') return null;                                      // blank while checking
  if (status === 'redirect-signin') return <Navigate to="/lucid/signin" replace />; // not logged in
  if (status === 'redirect-home') return <Navigate to="/lucid/" replace />;   // wrong role
  return children;                                                            // all checks passed
};


// ─────────────────────────────────────────────────────────────────────────────
// Layout
//
// Wraps every page. Decides whether to show the shared Navbar and Footer.
//
// Dashboard, account, booking, and messaging pages have their own full-screen
// layouts (they manage their own headers/navigation) so the global Navbar and
// Footer would duplicate controls and break the design.
//
// Two hide lists:
//   hideNavAndFooterExact   — exact pathname matches (e.g. /lucid/dashboard)
//   hideNavAndFooterPrefix  — prefix matches (e.g. /lucid/messages/123)
//
// To hide nav/footer on a new page: add its path to the appropriate list.
// ─────────────────────────────────────────────────────────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Layout({ children }) {
  const location = useLocation(); // current URL — re-evaluates on every navigation

  // Pages that manage their own full-screen layout (no shared Navbar/Footer)
  const hideNavAndFooterExact = [
    '/lucid/account',                 // AccountPage (role-switcher wrapper)
    '/lucid/notifications',           // NotificationsPage
    '/lucid/dashboard',               // DashboardPage (role-switcher wrapper)
    '/lucid/bookings',                // BookingsPage (role-switcher wrapper)
    '/lucid/bookings/history',        // BookingHistoryPage (role-switcher wrapper)
    '/lucid/notifications/settings',  // NotificationSettings
    '/lucid/earnings',                // EarningsPayments (provider only)
    '/lucid/messages',                // MessagesListPage
    '/lucid/account/profile',         // UserProfile (provider's own profile)
    '/lucid/bookings/confirmation',   // BookingConfirmation
    '/lucid/bookings/new',            // BookingRequest
    '/lucid/account/profile/edit',    // EditProfile
    '/lucid/account/profile/setup',  // ProviderProfileSetup (onboarding)
    '/lucid/help',                   // Help & Support page
  ];

  // Prefix-based hide — catches dynamic segments like /lucid/messages/abc123
  const hideNavAndFooterPrefix = [
    '/lucid/messages/', // individual chat threads — /lucid/messages/:id
  ];

  const shouldHideLayout =
    hideNavAndFooterExact.includes(location.pathname) ||
    hideNavAndFooterPrefix.some(prefix => location.pathname.startsWith(prefix));

  return (
    <>
      {!shouldHideLayout && <Navbar />}   {/* shown on public pages only */}
      <ProfileSetupBanner />              {/* visible sitewide until provider completes setup */}
      {children}                          {/* the actual page component */}
      {!shouldHideLayout && <Footer />}   {/* shown on public pages only */}
    </>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// App — root component
//
// Tree:
//   NotificationProvider         — global toast system (outermost, wraps everything)
//     Router (BrowserRouter)     — enables client-side routing
//       Layout                   — conditionally renders Navbar + Footer
//         Routes                 — matches current URL to a page component
//           Route ...            — each URL pattern mapped to a component
// ─────────────────────────────────────────────────────────────────────────────
function App() {
  return (
    // NotificationProvider must be outside Router so navbar and pages
    // can both call useNotification() for the same notification queue.
    <NotificationProvider>
      <LocationProvider>
      <Router>
        {/* ScrollToTop resets scroll position on every route change */}
        <ScrollToTop />
        {/* Layout reads location from Router context — must be inside <Router> */}
        <Layout>
          <Routes>

            {/* ── PUBLIC ROUTES ─────────────────────────────────────────────
                No authentication needed. Anyone can reach these pages.      */}

            <Route path="/lucid/"              element={<Home />} />
            {/* Landing page. Entry point for new visitors. */}

            <Route path="/lucid/signup"        element={<Signup />} />
            {/* New user registration — both client and provider accounts. */}

            <Route path="/lucid/signin"        element={<Signin />} />
            {/* Login. ProtectedRoute redirects here when session is missing. */}

            <Route path="/lucid/about"         element={<About />} />
            {/* Static about page — company info, mission, team. */}

            <Route path="/lucid/help"          element={<HelpSupport />} />
            {/* Help & support — FAQs, contact form. */}

            <Route path="/lucid/become-provider" element={<Signup />} />
            {/* Same sign-up page, different entry point from marketing CTAs.
                The Signup component can detect this path to pre-select "provider". */}


            {/* ── SERVICES DISCOVERY (Phase 2) ──────────────────────────────
                ⚠️  Route ORDER matters in this block.
                /lucid/services/all MUST be declared before /lucid/services/:category.
                React Router matches top-to-bottom — if /:category comes first,
                "all" is treated as a category slug and AllCategories never renders. */}

            <Route path="/lucid/search"                      element={<Service />} />
            {/* Alias for /lucid/services — the navbar search bar routes here.
                Service.jsx handles both paths identically. */}

            <Route path="/lucid/services"                    element={<Service />} />
            {/* Services landing page: hero search, popular services, featured categories. */}

            <Route path="/lucid/services/all"                element={<AllCategories />} />
            {/* Grid of all 10 categories. "all" is a literal — must be before /:category. */}

            <Route path="/lucid/services/:category"          element={<Category />} />
            {/* :category = slug from categories.js, e.g. "home-repairs".
                category.jsx calls getCategoryBySlug(params.category) to find the data. */}

            <Route path="/lucid/services/:category/:service" element={<Selected_service />} />
            {/* :service = service slug within the category, e.g. "electrical-repairs".
                Provider cards here link to /lucid/providers/:id (Phase 3). */}


            {/* ── PROVIDER PROFILE (Phase 3) ────────────────────────────────
                Public — a client can view any provider's profile without logging in. */}

            <Route path="/lucid/providers/:id"               element={<GeneralProfile />} />
            {/* Public provider profile. :id is the provider's Supabase user ID.
                selected_service.jsx links here after the user picks a provider. */}


            {/* ── PROTECTED — ANY AUTHENTICATED USER ────────────────────────
                ProtectedRoute checks Supabase session. Redirects to /lucid/signin
                if the user is not logged in. No role restriction on this group.  */}

            <Route path="/lucid/dashboard"
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            {/* Role-switcher: renders ClientDashboard or ProviderDashboard
                based on the user's role from the profiles table. */}

            <Route path="/lucid/account"
              element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            {/* Role-switcher: renders ClientAccountOverview or ProviderAccountOverview. */}

            <Route path="/lucid/account/settings"
              element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
            {/* Account settings: name, email, phone number edits.
                Linked from ProviderAccountOverview and ClientAccountOverview. */}

            <Route path="/lucid/account/profile"
              element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            {/* Provider's own profile view (what they see, not what clients see).
                Edit button links to /lucid/account/profile/edit. */}

            <Route path="/lucid/account/profile/edit"
              element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            {/* Provider edits their profile. On save, navigates to /lucid/dashboard. */}

            <Route path="/lucid/account/profile/setup"
              element={<ProtectedRoute><ProviderProfileSetup /></ProtectedRoute>} />
            {/* Post-signup onboarding step for providers. Back → /lucid/. Save → /lucid/dashboard. */}

            <Route path="/lucid/bookings"
              element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
            {/* Role-switcher: renders ClientBookings or ProviderBookings. */}

            <Route path="/lucid/bookings/new"
              element={<ProtectedRoute><BookingRequest /></ProtectedRoute>} />
            {/* Client fills out the booking request form for a specific provider. */}

            <Route path="/lucid/bookings/confirmation"
              element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />
            {/* Confirmation screen after a booking request is submitted. */}

            <Route path="/lucid/bookings/history"
              element={<ProtectedRoute><BookingHistoryPage /></ProtectedRoute>} />
            {/* Role-switcher: renders ClientHistory or ProviderHistory. */}

            <Route path="/lucid/messages"
              element={<ProtectedRoute><MessagesListPage /></ProtectedRoute>} />
            {/* Inbox — list of all conversations for the logged-in user. */}

            <Route path="/lucid/messages/:id"
              element={<ProtectedRoute><ChatMessagingPage /></ProtectedRoute>} />
            {/* Individual chat thread. :id is the conversation/thread ID.
                Hidden from prefix list in Layout so no Navbar/Footer shows. */}

            <Route path="/lucid/notifications"
              element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            {/* List of all notifications for the logged-in user. */}

            <Route path="/lucid/notifications/settings"
              element={<ProtectedRoute><NotificationSettings /></ProtectedRoute>} />
            {/* Notification preferences — which alerts to receive and how. */}


            {/* ── PROTECTED — SERVICE_PROVIDER ONLY ─────────────────────────
                ProtectedRoute checks session AND role.
                Clients hitting this route are redirected to /lucid/ (home). */}

            <Route path="/lucid/earnings"
              element={
                <ProtectedRoute allowedRoles={['service_provider']}>
                  <EarningsPayments />
                </ProtectedRoute>
              } />
            {/* Earnings dashboard: total income, withdrawal history, payout settings.
                Clients do not have an earnings page — role guard prevents access. */}


            {/* ── CATCH-ALL ─────────────────────────────────────────────────
                Any URL not matched above redirects to the home page.
                Prevents blank "not found" screens on mistyped URLs. */}

            <Route path="*" element={<Navigate to="/lucid/" replace />} />

          </Routes>
        </Layout>
      </Router>
      </LocationProvider>
    </NotificationProvider>
  );
}

export default App;
