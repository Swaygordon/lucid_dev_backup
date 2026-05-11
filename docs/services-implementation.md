# Services Implementation Guide — Lucid Ghana Marketplace

## Overview

This document defines the complete service taxonomy for Lucid, the data structures, imagery, icon mapping, and step-by-step implementation of:

1. **Popular Services grid** (Services page)
2. **Carousel / "Services you might also like"** (Services page, ×2)
3. **BusinessCategorySection** — 4 featured categories with sub-services
4. **All Categories page** (`/lucid/services/all`) — full taxonomy with breadcrumb flow
5. **Hero section pattern** — category icon + image on Category and Service pages
6. **"More" button routing** from BusinessCategorySection → All Categories page

---

## 1. Full Service Taxonomy

10 top-level categories, each with 3–5 sub-services.

| # | Category | Slug | Icon (Lucide) |
|---|----------|------|---------------|
| 1 | Home Repairs & Maintenance | `home-repairs` | `Hammer` |
| 2 | Moving & Relocation | `moving` | `Truck` |
| 3 | Auto Repairs | `auto-repairs` | `Car` |
| 4 | Construction & Renovation | `construction` | `HardHat` |
| 5 | Beauty & Personal Care | `beauty` | `Scissors` |
| 6 | Events & Catering | `events` | `PartyPopper` |
| 7 | Skilled Trades | `skilled-trades` | `Wrench` |
| 8 | Cleaning Services | `cleaning` | `Sparkles` |
| 9 | Education & Tutoring | `education` | `BookOpen` |
| 10 | Technology & Electronics | `tech` | `Cpu` |

### Sub-services per category

```
home-repairs
  ├── electrical-repairs   Electrician
  ├── plumbing             Plumber
  ├── painting             House Painting
  ├── tiling               Tiling & Flooring
  └── handyman             Handyman

moving
  ├── furniture-moving     Furniture Moving
  ├── packing              Packing Services
  ├── storage              Storage Solutions
  └── office-relocation    Office Relocation

auto-repairs
  ├── engine-repair        Engine Repair
  ├── brake-service        Brake Service
  ├── oil-change           Oil Change
  ├── vulcanizing          Vulcanizing (Tyres)
  └── car-wash             Car Wash

construction
  ├── building             Building Construction
  ├── roofing              Roofing
  ├── renovation           Renovation
  ├── fencing              Fencing & Gates
  └── masonry              Masonry & Plastering

beauty
  ├── hair-braiding        Hair Braiding
  ├── natural-hair         Natural Hair Styling
  ├── makeup               Makeup & Beauty
  ├── tailoring            Tailoring & Seamstress
  └── barbering            Barbering

events
  ├── event-planning       Event Planning
  ├── catering             Catering
  ├── decoration           Decoration
  ├── photography          Photography
  └── music-dj             Music & DJ

skilled-trades
  ├── carpentry            Carpentry
  ├── welding              Welding
  ├── solar-installation   Solar & Generator Install
  ├── ac-repair            AC Repair
  └── furniture-making     Furniture Making

cleaning
  ├── house-cleaning       House Cleaning
  ├── office-cleaning      Office Cleaning
  ├── deep-cleaning        Deep Cleaning
  ├── laundry              Laundry & Ironing
  └── waste-collection     Waste Collection

education
  ├── math-tutoring        Maths Tutoring
  ├── english-tutoring     English Tutoring
  ├── music-lessons        Music Lessons
  ├── driving-lessons      Driving Lessons
  └── computer-training    Computer Training

tech
  ├── phone-repair         Phone Repair
  ├── laptop-repair        Laptop Repair
  ├── cctv-installation    CCTV Installation
  ├── network-setup        Network & Wi-Fi Setup
  └── it-support           IT Support
```

---

## 2. Popular Services (Services Page Grid)

8 services displayed in the `Popular services near you` grid.
These are the most-searched services in Ghana.

| Icon | Name | Category Slug |
|------|------|---------------|
| `Zap` | Electrician | `home-repairs` |
| `Sparkles` | House Cleaning | `cleaning` |
| `Truck` | Moving Services | `moving` |
| `Droplets` | Plumber | `home-repairs` |
| `Car` | Auto Repair | `auto-repairs` |
| `Scissors` | Hair Braiding | `beauty` |
| `Shirt` | Tailoring | `beauty` |
| `PaintRoller` | House Painting | `home-repairs` |

**Data structure update for `SERVICES` in `Services.jsx`:**

```js
import { Zap, Sparkles, Truck, Droplets, Car, Scissors, Shirt, PaintRoller } from 'lucide-react';

const SERVICES = [
  { icon: Zap,         name: 'Electrician',    slug: 'home-repairs/electrical-repairs' },
  { icon: Sparkles,    name: 'House Cleaning', slug: 'cleaning/house-cleaning' },
  { icon: Truck,       name: 'Moving',         slug: 'moving/furniture-moving' },
  { icon: Droplets,    name: 'Plumber',        slug: 'home-repairs/plumbing' },
  { icon: Car,         name: 'Auto Repair',    slug: 'auto-repairs/engine-repair' },
  { icon: Scissors,    name: 'Hair Braiding',  slug: 'beauty/hair-braiding' },
  { icon: Shirt,       name: 'Tailoring',      slug: 'beauty/tailoring' },
  { icon: PaintRoller, name: 'House Painting', slug: 'home-repairs/painting' },
];
```

Update `ServiceCard` link to use the slug: `<Link to={`/lucid/services/${service.slug}`}>`.

---

## 3. Carousel Services ("Services you might also like")

7 cards displayed in the `ServicesCarousel` component. Used **twice** on the Services page (before and after the DownloadSection). The second instance can show the same data or a different slice.

| Name | Slug | Unsplash Image |
|------|------|----------------|
| Carpentry | `skilled-trades/carpentry` | `https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format` |
| House Cleaning | `cleaning/house-cleaning` | `https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format` |
| Construction | `construction/building` | `https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format` |
| Event Planning | `events/event-planning` | `https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format` |
| Electrical Work | `home-repairs/electrical-repairs` | `https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format` |
| Auto Repair | `auto-repairs/engine-repair` | `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&auto=format` |
| Hair Braiding | `beauty/hair-braiding` | `https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format` |

**Update `exploreServices` in `servicePage_carousel.jsx`:**

```js
const exploreServices = [
  { image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format', name: 'Carpentry',        slug: '/lucid/services/skilled-trades/carpentry' },
  { image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format', name: 'House Cleaning',   slug: '/lucid/services/cleaning/house-cleaning' },
  { image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format', name: 'Construction',     slug: '/lucid/services/construction/building' },
  { image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format', name: 'Event Planning',   slug: '/lucid/services/events/event-planning' },
  { image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format', name: 'Electrical Work',  slug: '/lucid/services/home-repairs/electrical-repairs' },
  { image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&auto=format', name: 'Auto Repair',      slug: '/lucid/services/auto-repairs/engine-repair' },
  { image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format', name: 'Hair Braiding',    slug: '/lucid/services/beauty/hair-braiding' },
];
```

Remove the local asset imports for slide images and delete the now-unused `Su_slide1` … `Su_slide7` import lines.

---

## 4. BusinessCategorySection — 4 Featured Categories

The `BusinessCategorySection` in `suggested_category.jsx` receives three props from `Services.jsx`:
`serviceIcons`, `businessCards`, `businessServices`.

### serviceIcons (tab buttons)

```js
import { Hammer, Truck, Car, HardHat } from 'lucide-react';

const SERVICE_ICONS = [
  { id: 1, icon: Hammer,  name: 'Home Repairs', slug: 'home-repairs' },
  { id: 2, icon: Truck,   name: 'Moving',       slug: 'moving' },
  { id: 3, icon: Car,     name: 'Auto Repairs', slug: 'auto-repairs' },
  { id: 4, icon: HardHat, name: 'Construction', slug: 'construction' },
];
```

### businessCards (hero images per tab)

Use Unsplash external images for vivid, high-quality backgrounds:

```js
const BUSINESS_CARDS = {
  'Home Repairs': {
    cat:                'Home Repairs',
    slug:               'home-repairs',
    mainCardBackground: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&auto=format',
    cardIcon:           Hammer,
    heading:            'Maintenance & Repair Experts Near You',
    seeAll:             'See all home repair services',
  },
  'Moving': {
    cat:                'Moving',
    slug:               'moving',
    mainCardBackground: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format',
    cardIcon:           Truck,
    heading:            'Trusted Moving & Relocation Services',
    seeAll:             'See all moving services',
  },
  'Auto Repairs': {
    cat:                'Auto Repairs',
    slug:               'auto-repairs',
    mainCardBackground: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&auto=format',
    cardIcon:           Car,
    heading:            'Professional Auto Repair & Maintenance',
    seeAll:             'See all auto repair services',
  },
  'Construction': {
    cat:                'Construction',
    slug:               'construction',
    mainCardBackground: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&auto=format',
    cardIcon:           HardHat,
    heading:            'Construction & Renovation Professionals',
    seeAll:             'See all construction services',
  },
};
```

### businessServices (grid cards under the hero)

3 sub-services per category, 12 total:

```js
const BUSINESS_SERVICES = [
  // Home Repairs
  { cat: 'Home Repairs', catSlug: 'home-repairs', slug: 'electrical-repairs',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format',
    title: 'Electrician', subtitle: 'See workers near you' },
  { cat: 'Home Repairs', catSlug: 'home-repairs', slug: 'plumbing',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format',
    title: 'Plumber', subtitle: 'See workers near you' },
  { cat: 'Home Repairs', catSlug: 'home-repairs', slug: 'painting',
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format',
    title: 'House Painting', subtitle: 'See workers near you' },

  // Moving
  { cat: 'Moving', catSlug: 'moving', slug: 'packing',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format',
    title: 'Packing Services', subtitle: 'See workers near you' },
  { cat: 'Moving', catSlug: 'moving', slug: 'furniture-moving',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format',
    title: 'Furniture Moving', subtitle: 'See workers near you' },
  { cat: 'Moving', catSlug: 'moving', slug: 'storage',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format',
    title: 'Storage Solutions', subtitle: 'See workers near you' },

  // Auto Repairs
  { cat: 'Auto Repairs', catSlug: 'auto-repairs', slug: 'engine-repair',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&auto=format',
    title: 'Engine Repair', subtitle: 'See workers near you' },
  { cat: 'Auto Repairs', catSlug: 'auto-repairs', slug: 'brake-service',
    image: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=600&auto=format',
    title: 'Brake Service', subtitle: 'See workers near you' },
  { cat: 'Auto Repairs', catSlug: 'auto-repairs', slug: 'vulcanizing',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format',
    title: 'Vulcanizing (Tyres)', subtitle: 'See workers near you' },

  // Construction
  { cat: 'Construction', catSlug: 'construction', slug: 'building',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format',
    title: 'Building Construction', subtitle: 'See workers near you' },
  { cat: 'Construction', catSlug: 'construction', slug: 'roofing',
    image: 'https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?w=600&auto=format',
    title: 'Roofing', subtitle: 'See workers near you' },
  { cat: 'Construction', catSlug: 'construction', slug: 'renovation',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format',
    title: 'Renovation', subtitle: 'See workers near you' },
];
```

---

## 5. All Categories Page

### Route

Add to `App.jsx` (before the dynamic `:category` route so it doesn't get swallowed):

```jsx
import AllCategories from './pages/AllCategories.jsx';

// In <Routes>:
<Route path="/lucid/services/all" element={<AllCategories />} />
<Route path="/lucid/services/:category" element={<Category />} />       // existing
<Route path="/lucid/services/:category/:service" element={<Selected_service />} /> // existing
```

### "More" button wiring in `suggested_category.jsx`

Replace the `MoreButton` component's inner button with a `Link`:

```jsx
import { Link } from 'react-router-dom';

const MoreButton = memo(({ isMobile = false }) => (
  <div className="flex flex-col items-center gap-2 snap-center">
    <div className={`relative ${isMobile ? 'w-16 h-16' : 'w-14 h-14'} flex items-center justify-center`}>
      <div className={`absolute top-0 ${isMobile ? 'left-6' : 'left-5'} right-2 w-12 h-12 bg-blue-300 rounded-lg`} />
      <Link to="/lucid/services/all">
        <motion.div
          className={`${isMobile ? 'absolute btn btn-square top-3 left-3' : 'relative top-2 left-1'} w-12 h-12 bg-blue-700 rounded-lg hover:bg-blue-300 flex items-center justify-center transition-all duration-300 cursor-pointer`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaEllipsisH size={20} className="text-white" />
        </motion.div>
      </Link>
    </div>
    <p className={`text-center ${isMobile ? 'text-xs mt-2' : 'text-sm mt-3'} text-black`}>More</p>
  </div>
));
```

### AllCategories page data

All 10 categories with Unsplash hero images and Lucide icons:

```js
import {
  Hammer, Truck, Car, HardHat, Scissors,
  PartyPopper, Wrench, Sparkles, BookOpen, Cpu
} from 'lucide-react';

export const ALL_CATEGORIES = [
  {
    id: 1,
    name: 'Home Repairs & Maintenance',
    slug: 'home-repairs',
    icon: Hammer,
    description: 'Electricians, plumbers, painters and more',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format',
    color: 'bg-blue-100',
    iconColor: 'text-blue-700',
  },
  {
    id: 2,
    name: 'Moving & Relocation',
    slug: 'moving',
    icon: Truck,
    description: 'Packing, transport and storage services',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format',
    color: 'bg-green-100',
    iconColor: 'text-green-700',
  },
  {
    id: 3,
    name: 'Auto Repairs',
    slug: 'auto-repairs',
    icon: Car,
    description: 'Mechanics, tyre repairs and car wash',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format',
    color: 'bg-red-100',
    iconColor: 'text-red-700',
  },
  {
    id: 4,
    name: 'Construction & Renovation',
    slug: 'construction',
    icon: HardHat,
    description: 'Building, roofing, masonry and more',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format',
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-700',
  },
  {
    id: 5,
    name: 'Beauty & Personal Care',
    slug: 'beauty',
    icon: Scissors,
    description: 'Hair braiding, tailoring, makeup artists',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format',
    color: 'bg-pink-100',
    iconColor: 'text-pink-700',
  },
  {
    id: 6,
    name: 'Events & Catering',
    slug: 'events',
    icon: PartyPopper,
    description: 'Planners, caterers, DJs and decorators',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format',
    color: 'bg-purple-100',
    iconColor: 'text-purple-700',
  },
  {
    id: 7,
    name: 'Skilled Trades',
    slug: 'skilled-trades',
    icon: Wrench,
    description: 'Carpenters, welders, AC technicians',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format',
    color: 'bg-orange-100',
    iconColor: 'text-orange-700',
  },
  {
    id: 8,
    name: 'Cleaning Services',
    slug: 'cleaning',
    icon: Sparkles,
    description: 'Home, office, deep cleaning and laundry',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format',
    color: 'bg-cyan-100',
    iconColor: 'text-cyan-700',
  },
  {
    id: 9,
    name: 'Education & Tutoring',
    slug: 'education',
    icon: BookOpen,
    description: 'Tutors, driving lessons, computer training',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format',
    color: 'bg-indigo-100',
    iconColor: 'text-indigo-700',
  },
  {
    id: 10,
    name: 'Technology & Electronics',
    slug: 'tech',
    icon: Cpu,
    description: 'Phone repair, CCTV, Wi-Fi setup, IT support',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format',
    color: 'bg-gray-100',
    iconColor: 'text-gray-700',
  },
];
```

### AllCategories page component (`src/pages/AllCategories.jsx`)

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ALL_CATEGORIES } from '../data/categories'; // move data to a shared file
import Breadcrumb from '../components/Breadcrumb';

const AllCategories = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Hero */}
    <div className="bg-blue-700 py-16 px-5 text-center">
      <h1 className="text-white text-4xl font-bold mb-2">All Services</h1>
      <p className="text-blue-200 text-lg">Find trusted service providers across Ghana</p>
    </div>

    {/* Breadcrumb */}
    <div className="max-w-6xl mx-auto px-5 pt-6">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/lucid/' }, { label: 'All Services' }]} />
    </div>

    {/* Category Grid */}
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/lucid/services/${cat.slug}`}>
                <div className="rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Icon badge */}
                    <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center shadow`}>
                      <Icon size={22} className={cat.iconColor} />
                    </div>
                  </div>
                  {/* Text */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h3>
                    <p className="text-sm text-gray-500">{cat.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);

export default AllCategories;
```

---

## 6. Breadcrumb Component

Create `src/components/Breadcrumb.jsx`:

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ crumbs }) => (
  <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
    {crumbs.map((crumb, i) => (
      <React.Fragment key={i}>
        {i > 0 && <ChevronRight size={14} className="text-gray-400" />}
        {crumb.href ? (
          <Link to={crumb.href} className="hover:text-blue-600 transition-colors">
            {crumb.label}
          </Link>
        ) : (
          <span className="text-gray-900 font-medium">{crumb.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export default Breadcrumb;
```

### Breadcrumb usage per page

| Page | Route | Crumbs |
|------|-------|--------|
| All Categories | `/lucid/services/all` | Home → All Services |
| Category | `/lucid/services/:category` | Home → All Services → {Category Name} |
| Service Detail | `/lucid/services/:category/:service` | Home → All Services → {Category} → {Service} |
| Providers | `/lucid/providers/:id` | Home → All Services → {Category} → {Service} → Provider |

Add to `category.jsx`:
```jsx
<Breadcrumb crumbs={[
  { label: 'Home', href: '/lucid/' },
  { label: 'All Services', href: '/lucid/services/all' },
  { label: categoryName },
]} />
```

Add to `selected_service.jsx`:
```jsx
<Breadcrumb crumbs={[
  { label: 'Home', href: '/lucid/' },
  { label: 'All Services', href: '/lucid/services/all' },
  { label: categoryName, href: `/lucid/services/${categorySlug}` },
  { label: serviceName },
]} />
```

---

## 7. Hero Section Pattern (Category & Service Pages)

Every Category page (`/lucid/services/:category`) and Service page (`/lucid/services/:category/:service`) should have a hero section containing:

- Full-width background image (from `ALL_CATEGORIES` image)
- Semi-transparent dark overlay
- Category icon (Lucide) in a rounded badge top-left or centred
- Page title and subtitle

**Pattern JSX (reusable, add to `category.jsx` and `selected_service.jsx`):**

```jsx
// At top of file, resolve category data from slug param
import { useParams } from 'react-router-dom';
import { ALL_CATEGORIES } from '../data/categories';

// Inside component:
const { category: categorySlug } = useParams();
const categoryData = ALL_CATEGORIES.find(c => c.slug === categorySlug);
const CategoryIcon = categoryData?.icon;

// Hero JSX:
<div className="relative w-full h-64 md:h-80 overflow-hidden">
  <img
    src={categoryData?.image}
    alt={categoryData?.name}
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 bg-black bg-opacity-50" />
  <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-5">
    {/* Category icon badge */}
    {CategoryIcon && (
      <div className="w-16 h-16 rounded-2xl bg-white bg-opacity-20 border border-white border-opacity-40 flex items-center justify-center mb-4 backdrop-blur-sm">
        <CategoryIcon size={32} className="text-white" />
      </div>
    )}
    <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
      {categoryData?.name}
    </h1>
    <p className="text-white text-opacity-80 text-base">
      {categoryData?.description}
    </p>
  </div>
</div>
```

---

## 8. Shared Data File

To avoid duplicating `ALL_CATEGORIES` across multiple files, move it to a single shared module:

**Create `src/data/categories.js`:**

```js
import {
  Hammer, Truck, Car, HardHat, Scissors,
  PartyPopper, Wrench, Sparkles, BookOpen, Cpu
} from 'lucide-react';

export const ALL_CATEGORIES = [ /* paste the array from Section 5 */ ];

export const getCategoryBySlug = (slug) =>
  ALL_CATEGORIES.find(c => c.slug === slug) ?? null;
```

Import in:
- `src/pages/AllCategories.jsx`
- `src/pages/Services.jsx` (replace `SERVICE_ICONS` and `BUSINESS_CARDS` references)
- `src/pages/category.jsx`
- `src/pages/selected_service.jsx`

---

## 9. Implementation Checklist

### Phase 1 — Data & Shared Assets
- [ ] Create `src/data/categories.js` with `ALL_CATEGORIES`
- [ ] Create `src/components/Breadcrumb.jsx`
- [ ] Create `src/pages/AllCategories.jsx`
- [ ] Add `/lucid/services/all` route in `App.jsx` (before `:category` route)
- [ ] Import `AllCategories` in `App.jsx`

### Phase 2 — Services Page
- [ ] Replace `SERVICES` array in `Services.jsx` with Ghana-specific 8-item list
- [ ] Update `ServiceCard` `<Link>` to use `service.slug`
- [ ] Replace `SERVICE_ICONS` with 4-item array using `Hammer, Truck, Car, HardHat`
- [ ] Replace `BUSINESS_CARDS` with Unsplash image URLs and `slug` field
- [ ] Replace `BUSINESS_SERVICES` with 12-item array using `catSlug` + `slug`
- [ ] Remove local asset imports that are no longer needed

### Phase 3 — Carousel
- [ ] Replace local asset imports in `servicePage_carousel.jsx` with Unsplash URLs
- [ ] Update `exploreServices` array with 7 Ghana-relevant services

### Phase 4 — BusinessCategorySection
- [ ] Update `MoreButton` in `suggested_category.jsx` to `<Link to="/lucid/services/all">`
- [ ] Verify hero card and service card `<Link>` targets use `slug` / `catSlug` correctly

### Phase 5 — Category & Service Pages
- [ ] Add `Breadcrumb` to `category.jsx`
- [ ] Add hero section with icon to `category.jsx`
- [ ] Add `Breadcrumb` to `selected_service.jsx`
- [ ] Add hero section with icon to `selected_service.jsx`

---

## 10. Image Attribution Note

All Unsplash images require attribution in production. Add to the site footer or a `/credits` page:

```
Photography: Unsplash contributors (unsplash.com/license)
```

Unsplash images are free to use commercially without direct credit, but attribution is good practice and appreciated by creators.

---

*Last updated: 2026-05-09*
