// ─────────────────────────────────────────────────────────────────────────────
// App.jsx — Root of the Lucid application
//
// Responsibilities:
//   1. Wrap the whole app in NotificationProvider (global toast/alert system)
//   2. Set up React Router with a shared Layout (Navbar + Footer)
//   3. Declare every route and protect authenticated-only routes
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, lazy, Suspense } from 'react';

// React Router — BrowserRouter uses the HTML5 history API (clean URLs, no #hash).
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

// Global notification system — wraps the whole app so any page can call
// useNotification() to show toast messages without prop drilling.
import { NotificationProvider } from './contexts/NotificationContext';
import { LocationProvider } from './contexts/LocationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavouritesProvider } from './contexts/FavouritesContext';

// Supabase client — used here only in ProtectedRoute to check the session.
// Pages import it directly from this same file when they need auth operations.
import { supabase } from './lib/supabaseClient';

// ─── Shared layout components — eagerly loaded (present on every page) ────────
import Navbar from "./components/navbar";
import Footer from './components/footer';
import ProfileSetupBanner from './components/ProfileSetupBanner.jsx';

// ─── Per-route loading skeletons ──────────────────────────────────────────────
// Each lazy route gets its own Suspense boundary with a tailored fallback,
// so navigating to /signin doesn't briefly flash a home-shaped skeleton.
import {
  HomeSkeleton,
  AuthFormSkeleton,
  ServicesSkeleton,
  ProfileSkeleton,
  BookingsSkeleton,
  ContentPageSkeleton,
} from './components/route_skeletons.jsx';

// ─── Page-level code splitting ────────────────────────────────────────────────
// Each lazy() call creates a separate chunk. Vite only downloads a chunk when
// the user first navigates to that route — the home page visit doesn't pull in
// dashboard, messaging, or booking code.

// Public pages
const Home               = lazy(() => import('./pages/home.jsx'));
const About              = lazy(() => import('./pages/about.jsx'));
const HelpSupport        = lazy(() => import('./pages/help_support.jsx'));

// Auth & onboarding (Phase 1)
const Signup             = lazy(() => import('./pages/sign_up.jsx'));
const Signin             = lazy(() => import('./pages/sign_in.jsx'));
// Services discovery (Phase 2)
const Service            = lazy(() => import('./pages/Services.jsx'));
const AllCategories      = lazy(() => import('./pages/AllCategories.jsx'));
const Category           = lazy(() => import('./pages/category.jsx'));
const Selected_service   = lazy(() => import('./pages/selected_service.jsx'));

// Provider profile (Phase 3)
const GeneralProfile        = lazy(() => import('./pages/general_profilePage.jsx'));
const UserProfile           = lazy(() => import('./pages/user_Profile.jsx'));
const EditProfile           = lazy(() => import('./pages/edit.jsx'));
const ProviderProfileSetup  = lazy(() => import('./pages/provider_profile_setup.jsx'));

// Bookings (Phase 4)
const ClientBookings     = lazy(() => import('./pages/client_bookings.jsx'));
const ProviderBookings   = lazy(() => import('./pages/provider_bookings.jsx'));
const BookingsPage       = lazy(() => import('./pages/BookingsPage.jsx'));
const ClientHistory      = lazy(() => import('./pages/client_history.jsx'));
const ProviderHistory    = lazy(() => import('./pages/provider_history.jsx'));
const BookingHistoryPage = lazy(() => import('./pages/BookingHistoryPage.jsx'));
const BookingRequest     = lazy(() => import('./pages/booking_request.jsx'));
const BookingConfirmation = lazy(() => import('./pages/booking_confirmation.jsx'));

// Dashboard (Phase 5)
const ClientDashboard    = lazy(() => import('./pages/client_dashboard.jsx'));
const ProviderDashboard  = lazy(() => import('./pages/provider_dashboard.jsx'));
const DashboardPage      = lazy(() => import('./pages/DashboardPage.jsx'));
const EarningsPayments   = lazy(() => import('./pages/earnings.jsx'));
const TransactionsPage   = lazy(() => import('./pages/transactions.jsx'));
const Favourites         = lazy(() => import('./pages/favourites.jsx'));

// Account & settings (Phase 6)
const ClientAccountOverview   = lazy(() => import('./pages/client_account_overview.jsx'));
const ProviderAccountOverview = lazy(() => import('./pages/provider_account_overview.jsx'));
const AccountPage             = lazy(() => import('./pages/AccountPage.jsx'));
const AccountSettings         = lazy(() => import('./pages/user_info.jsx'));
const NotificationsPage       = lazy(() => import('./pages/notification_page.jsx'));
const NotificationSettings    = lazy(() => import('./pages/notificationSettings.jsx'));

// Messaging (Phase 7)
const MessagesListPage  = lazy(() => import('./pages/messagelist.jsx'));
const ChatMessagingPage = lazy(() => import('./pages/messaging.jsx'));



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

// Helper: wraps a lazy page in its own Suspense boundary with a tailored fallback.
// This is what stops the home-shaped skeleton from flashing on every route.
const withFallback = (element, Fallback) => (
  <Suspense fallback={<Fallback />}>{element}</Suspense>
);

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
    '/lucid/transactions',            // TransactionsPage (provider only)
    '/lucid/messages',                // MessagesListPage
    '/lucid/account/profile',         // UserProfile (provider's own profile)
    '/lucid/bookings/confirmation',   // BookingConfirmation
    '/lucid/bookings/new',            // BookingRequest
    '/lucid/account/profile/edit',    // EditProfile
    '/lucid/account/profile/setup',  // ProviderProfileSetup (onboarding)
    '/lucid/help',                   // Help & Support page
    '/lucid/account/settings',       // AccountSettings (user info edits)
    '/lucid/favourites',              // Favourites (client's saved providers)
  ];

  // Prefix-based hide — catches dynamic segments like /lucid/messages/abc123
  const hideNavAndFooterPrefix = [
    '/lucid/messages/',   // individual chat threads — /lucid/messages/:id
    '/lucid/providers/',  // public provider profiles — /lucid/providers/:id (has its own header)
    '/lucid/bookings/new/', // booking request form for a specific provider
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
    <ThemeProvider>
    <NotificationProvider>
      <FavouritesProvider>
      <LocationProvider>
      <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        {/* ScrollToTop resets scroll position on every route change */}
        <ScrollToTop />
        {/* Layout reads location from Router context — must be inside <Router> */}
        <Layout>
          <Routes>

            {/* ── PUBLIC ROUTES ─────────────────────────────────────────────
                No authentication needed. Anyone can reach these pages.      */}

            <Route path="/lucid/"              element={withFallback(<Home />, HomeSkeleton)} />
            {/* Landing page. Entry point for new visitors. */}

            <Route path="/lucid/signup"        element={withFallback(<Signup />, AuthFormSkeleton)} />
            {/* New user registration — both client and provider accounts. */}

            <Route path="/lucid/signin"        element={withFallback(<Signin />, AuthFormSkeleton)} />
            {/* Login. ProtectedRoute redirects here when session is missing. */}

            <Route path="/lucid/about"         element={withFallback(<About />, ContentPageSkeleton)} />
            {/* Static about page — company info, mission, team. */}

            <Route path="/lucid/help"          element={withFallback(<HelpSupport />, ContentPageSkeleton)} />
            {/* Help & support — FAQs, contact form. */}

            <Route path="/lucid/become-provider" element={withFallback(<Signup />, AuthFormSkeleton)} />
            {/* Same sign-up page, different entry point from marketing CTAs.
                The Signup component can detect this path to pre-select "provider". */}


            {/* ── SERVICES DISCOVERY (Phase 2) ──────────────────────────────
                ⚠️  Route ORDER matters in this block.
                /lucid/services/all MUST be declared before /lucid/services/:category.
                React Router matches top-to-bottom — if /:category comes first,
                "all" is treated as a category slug and AllCategories never renders. */}

            <Route path="/lucid/search"                      element={withFallback(<Service />, ServicesSkeleton)} />
            {/* Alias for /lucid/services — the navbar search bar routes here.
                Service.jsx handles both paths identically. */}

            <Route path="/lucid/services"                    element={withFallback(<Service />, ServicesSkeleton)} />
            {/* Services landing page: hero search, popular services, featured categories. */}

            <Route path="/lucid/services/all"                element={withFallback(<AllCategories />, ServicesSkeleton)} />
            {/* Grid of all 10 categories. "all" is a literal — must be before /:category. */}

            <Route path="/lucid/services/:category"          element={withFallback(<Category />, ServicesSkeleton)} />
            {/* :category = slug from categories.js, e.g. "home-repairs".
                category.jsx calls getCategoryBySlug(params.category) to find the data. */}

            <Route path="/lucid/services/:category/:service" element={withFallback(<Selected_service />, ServicesSkeleton)} />
            {/* :service = service slug within the category, e.g. "electrical-repairs".
                Provider cards here link to /lucid/providers/:id (Phase 3). */}


            {/* ── PROVIDER PROFILE (Phase 3) ────────────────────────────────
                Public — a client can view any provider's profile without logging in. */}

            <Route path="/lucid/providers/:id"               element={withFallback(<GeneralProfile />, ProfileSkeleton)} />
            {/* Public provider profile. :id is the provider's Supabase user ID.
                selected_service.jsx links here after the user picks a provider. */}


            {/* ── PROTECTED — ANY AUTHENTICATED USER ────────────────────────
                ProtectedRoute checks Supabase session. Redirects to /lucid/signin
                if the user is not logged in. No role restriction on this group.  */}

            <Route path="/lucid/dashboard"
              element={<ProtectedRoute>{withFallback(<DashboardPage />, BookingsSkeleton)}</ProtectedRoute>} />
            {/* Role-switcher: renders ClientDashboard or ProviderDashboard
                based on the user's role from the profiles table. */}

            <Route path="/lucid/account"
              element={<ProtectedRoute>{withFallback(<AccountPage />, ProfileSkeleton)}</ProtectedRoute>} />
            {/* Role-switcher: renders ClientAccountOverview or ProviderAccountOverview. */}

            <Route path="/lucid/account/settings"
              element={<ProtectedRoute>{withFallback(<AccountSettings />, ContentPageSkeleton)}</ProtectedRoute>} />
            {/* Account settings: name, email, phone number edits.
                Linked from ProviderAccountOverview and ClientAccountOverview. */}

            <Route path="/lucid/account/profile"
              element={<ProtectedRoute>{withFallback(<UserProfile />, ProfileSkeleton)}</ProtectedRoute>} />
            {/* Provider's own profile view (what they see, not what clients see).
                Edit button links to /lucid/account/profile/edit. */}

            <Route path="/lucid/account/profile/edit"
              element={<ProtectedRoute>{withFallback(<EditProfile />, ProfileSkeleton)}</ProtectedRoute>} />
            {/* Provider edits their profile. On save, navigates to /lucid/dashboard. */}

            <Route path="/lucid/account/profile/setup"
              element={<ProtectedRoute>{withFallback(<ProviderProfileSetup />, ProfileSkeleton)}</ProtectedRoute>} />
            {/* Post-signup onboarding step for providers. Back → /lucid/. Save → /lucid/dashboard. */}

            <Route path="/lucid/bookings"
              element={<ProtectedRoute>{withFallback(<BookingsPage />, BookingsSkeleton)}</ProtectedRoute>} />
            {/* Role-switcher: renders ClientBookings or ProviderBookings. */}

            <Route path="/lucid/bookings/new/:providerId"
              element={<ProtectedRoute>{withFallback(<BookingRequest />, BookingsSkeleton)}</ProtectedRoute>} />
            {/* Client fills out the booking request form for a specific provider.
                booking_request.jsx reads :providerId via useParams() to load the provider
                and submit the booking — without the param, the page can't load anything. */}

            <Route path="/lucid/bookings/confirmation"
              element={<ProtectedRoute>{withFallback(<BookingConfirmation />, BookingsSkeleton)}</ProtectedRoute>} />
            {/* Confirmation screen after a booking request is submitted. */}

            <Route path="/lucid/bookings/history"
              element={<ProtectedRoute>{withFallback(<BookingHistoryPage />, BookingsSkeleton)}</ProtectedRoute>} />
            {/* Role-switcher: renders ClientHistory or ProviderHistory. */}

            <Route path="/lucid/favourites"
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  {withFallback(<Favourites />, ServicesSkeleton)}
                </ProtectedRoute>
              } />
            {/* Client's saved/favourite providers list. */}

            <Route path="/lucid/messages"
              element={<ProtectedRoute>{withFallback(<MessagesListPage />, BookingsSkeleton)}</ProtectedRoute>} />
            {/* Inbox — list of all conversations for the logged-in user. */}

            <Route path="/lucid/messages/:id"
              element={<ProtectedRoute>{withFallback(<ChatMessagingPage />, BookingsSkeleton)}</ProtectedRoute>} />
            {/* Individual chat thread. :id is the conversation/thread ID.
                Hidden from prefix list in Layout so no Navbar/Footer shows. */}

            <Route path="/lucid/notifications"
              element={<ProtectedRoute>{withFallback(<NotificationsPage />, BookingsSkeleton)}</ProtectedRoute>} />
            {/* List of all notifications for the logged-in user. */}

            <Route path="/lucid/notifications/settings"
              element={<ProtectedRoute>{withFallback(<NotificationSettings />, ContentPageSkeleton)}</ProtectedRoute>} />
            {/* Notification preferences — which alerts to receive and how. */}


            {/* ── PROTECTED — SERVICE_PROVIDER ONLY ─────────────────────────
                ProtectedRoute checks session AND role.
                Clients hitting this route are redirected to /lucid/ (home). */}

            <Route path="/lucid/earnings"
              element={
                <ProtectedRoute allowedRoles={['service_provider']}>
                  {withFallback(<EarningsPayments />, BookingsSkeleton)}
                </ProtectedRoute>
              } />
            {/* Earnings dashboard: total income, withdrawal history, payout settings.
                Clients do not have an earnings page — role guard prevents access. */}

            <Route path="/lucid/transactions"
              element={
                <ProtectedRoute allowedRoles={['service_provider']}>
                  {withFallback(<TransactionsPage />, BookingsSkeleton)}
                </ProtectedRoute>
              } />
            {/* Full transaction history with search and filters. Linked from earnings page. */}


            {/* ── CATCH-ALL ─────────────────────────────────────────────────
                Any URL not matched above redirects to the home page.
                Prevents blank "not found" screens on mistyped URLs. */}

            <Route path="*" element={<Navigate to="/lucid/" replace />} />

          </Routes>
        </Layout>
      </Router>
      </LocationProvider>
      </FavouritesProvider>
    </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
