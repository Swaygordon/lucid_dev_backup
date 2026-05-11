# Service Categorization & Implementation Guide

**Document Version:** 1.0  
**Date:** May 9, 2026  
**Status:** Implementation Ready

---

## Table of Contents

1. [Service Categorization Structure](#service-categorization-structure)
2. [Implementation Architecture](#implementation-architecture)
3. [Step-by-Step Implementation](#step-by-step-implementation)
4. [File Modifications Required](#file-modifications-required)
5. [Database Schema Updates](#database-schema-updates)
6. [Testing Checklist](#testing-checklist)

---

## Service Categorization Structure

### **TIER 1: Main Business Categories (Home Page - 4 Categories)**

These 4 categories will be prominently displayed in the business category section on the home page:

```
1. CLEANING & MAINTENANCE
   - Home Cleaning
   - Office Cleaning
   - Deep Cleaning/Disinfection
   - Pest Control/Fumigation

2. REPAIR & INSTALLATION
   - General Repair
   - Plumbing
   - Electrical
   - AC/HVAC Maintenance
   - Appliance Repair

3. MOVING & LOGISTICS
   - Moving Services
   - Delivery
   - Courier/Same-Day Delivery
   - Bulk Freight

4. HOME IMPROVEMENT & DESIGN
   - Painting
   - Carpentry
   - Tiling & Flooring
   - Interior Design
```

---

### **TIER 2: Popular & Recommended Services (Home Page - Slider)**

**Popular Services (First Slider - 4-5 items):**
```
1. Moving Services
2. Auto Repair & Maintenance
3. Pest Control/Fumigation
4. AC/HVAC Maintenance
```

**Recommended Services (Second Slider - 4-5 items):**
```
1. Carpentry
2. Appliance Repair
3. Hairdressing/Salon
4. Computer/Phone Repair
5. Security Installation (CCTV)
```

---

### **TIER 3: All Categories (Full Categories Page - 12 Categories)**

Accessible via "More Categories" button → Separate dedicated page:

```
1. Housing & Property Services
   - Plumbing, Electrical, Painting, Repairs, HVAC, Roofing

2. Cleaning & Sanitation
   - Home Cleaning, Office Cleaning, Carpet Cleaning, Fumigation

3. Logistics & Transport
   - Moving, Delivery, Courier, Freight

4. Landscaping & Outdoor
   - Gardening, Lawn Maintenance, Tree Trimming

5. Car & Vehicle Services
   - Auto Repair, Car Wash, Tire Service, Car Painting

6. Appliance Services
   - Refrigerator Repair, Washing Machine, Microwave, Generator, Solar

7. Skilled Trades
   - Carpentry, Welding, Tiling, Drywall, Locksmith

8. Personal Services
   - Hairdressing, Makeup, Massage, Fitness, Pet Grooming

9. IT & Tech Services
   - Computer Repair, Phone Repair, Internet, CCTV, Website Design

10. Maintenance & Facilities
    - Industrial Maintenance, Facility Management, Security, Waste

11. Event & Special Services
    - Event Planning, Catering, Photography, Decoration

12. Education & Training
    - Tutoring, Language Classes, Music, Professional Courses
```

---

## Implementation Architecture

### **Data Structure**

```typescript
// Service Category Interface
interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: IconType;
  tier: 'main' | 'popular' | 'recommended' | 'full';
  position: number;
  active: boolean;
  subcategories: string[]; // IDs of subcategories
  createdAt: timestamp;
  updatedAt: timestamp;
}

// Service Interface
interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  subcategoryId?: string;
  averagePrice: number;
  priceRange: { min: number; max: number };
  icon?: IconType;
  image?: string;
  popularity: number; // 1-10 score
  providers: string[]; // Provider IDs
  createdAt: timestamp;
  updatedAt: timestamp;
}

// Service Provider Specialization Interface
interface ProviderSpecialization {
  providerId: string;
  serviceId: string;
  serviceCategory: string;
  yearsOfExperience: number;
  certifications: string[];
  hourlyRate: number;
  rating: number;
  completedJobs: number;
}
```

---

## Step-by-Step Implementation

### **PHASE 1: Data Setup (Week 1)**

#### Step 1.1: Update Mock Data Files

**Create new file:** `src/data/mockCategories.js`

```javascript
export const MOCK_CATEGORIES = [
  // Main Business Categories (Tier 1)
  {
    id: 'cat-cleaning',
    name: 'Cleaning & Maintenance',
    slug: 'cleaning-maintenance',
    tier: 'main',
    position: 1,
    icon: 'FaBroom',
    description: 'Professional cleaning and fumigation services',
    subcategories: [
      'home-cleaning',
      'office-cleaning',
      'pest-control',
      'deep-cleaning'
    ]
  },
  {
    id: 'cat-repair',
    name: 'Repair & Installation',
    slug: 'repair-installation',
    tier: 'main',
    position: 2,
    icon: 'FaWrench',
    description: 'Expert repair and installation services',
    subcategories: [
      'general-repair',
      'plumbing',
      'electrical',
      'hvac',
      'appliance-repair'
    ]
  },
  {
    id: 'cat-moving',
    name: 'Moving & Logistics',
    slug: 'moving-logistics',
    tier: 'main',
    position: 3,
    icon: 'FaTruck',
    description: 'Reliable moving and delivery services',
    subcategories: [
      'moving',
      'delivery',
      'courier',
      'freight'
    ]
  },
  {
    id: 'cat-home-improvement',
    name: 'Home Improvement & Design',
    slug: 'home-improvement-design',
    tier: 'main',
    position: 4,
    icon: 'FaPaintRoller',
    description: 'Transform your space with our services',
    subcategories: [
      'painting',
      'carpentry',
      'tiling',
      'interior-design'
    ]
  },
  // Popular Services (Tier 2)
  {
    id: 'cat-auto-repair',
    name: 'Auto Repair & Maintenance',
    slug: 'auto-repair',
    tier: 'popular',
    position: 1,
    icon: 'FaCar',
    description: 'Professional vehicle repair and maintenance'
  },
  {
    id: 'cat-pest-control',
    name: 'Pest Control & Fumigation',
    slug: 'pest-control',
    tier: 'popular',
    position: 2,
    icon: 'FaSpray',
    description: 'Effective pest elimination services'
  },
  {
    id: 'cat-hvac',
    name: 'AC/HVAC Maintenance',
    slug: 'hvac-maintenance',
    tier: 'popular',
    position: 3,
    icon: 'FaWind',
    description: 'Cooling system repair and maintenance'
  },
  // Recommended Services (Tier 2)
  {
    id: 'cat-carpentry',
    name: 'Carpentry',
    slug: 'carpentry',
    tier: 'recommended',
    position: 1,
    icon: 'FaSaw',
    description: 'Expert carpentry and furniture services'
  },
  {
    id: 'cat-appliance',
    name: 'Appliance Repair',
    slug: 'appliance-repair',
    tier: 'recommended',
    position: 2,
    icon: 'FaRefrigerator',
    description: 'Repair for all household appliances'
  },
  {
    id: 'cat-salon',
    name: 'Hairdressing & Salon',
    slug: 'hairdressing-salon',
    tier: 'recommended',
    position: 3,
    icon: 'FaScissors',
    description: 'Professional hair and beauty services'
  },
  // Full list (Tier 3) would include all 12 categories...
];
```

**Update file:** `src/data/mockProfiles.js`

Add service specializations to provider profiles:

```javascript
// In each provider object, add:
specializations: [
  {
    serviceCategory: 'Cleaning',
    yearsOfExperience: 5,
    certifications: ['Health & Safety Certified'],
    hourlyRate: 50,
  }
]
```

#### Step 1.2: Create Service Listing Data

**Create new file:** `src/data/mockServices.js`

```javascript
export const MOCK_SERVICES = [
  {
    id: 'svc-cleaning-home',
    name: 'Home Cleaning',
    categoryId: 'cat-cleaning',
    description: 'Comprehensive home cleaning service',
    averagePrice: 60,
    priceRange: { min: 30, max: 100 },
    popularity: 9,
    tier: 'main'
  },
  {
    id: 'svc-moving',
    name: 'Moving Services',
    categoryId: 'cat-moving',
    description: 'Professional home and office relocation',
    averagePrice: 200,
    priceRange: { min: 100, max: 500 },
    popularity: 10,
    tier: 'main'
  },
  // ... continue for all services
];
```

---

### **PHASE 2: Frontend Components (Week 2)**

#### Step 2.1: Create Category Components

**Create new file:** `src/components/CategoryGrid.jsx`

```javascript
import React from 'react';
import { motion } from 'framer-motion';
import { Card, Button } from './ui';
import { useNavigate } from 'react-router-dom';

export const CategoryGrid = ({ categories, title, onCategoryClick }) => {
  const navigate = useNavigate();

  return (
    <motion.div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            hoverable
            className="cursor-pointer"
            onClick={() => navigate(`/lucid/services/${category.slug}`)}
          >
            <div className="p-6 text-center">
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {category.description}
              </p>
              <Button variant="outline">Browse</Button>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
};
```

#### Step 2.2: Update Home Page

**File:** `src/pages/home.jsx`

Add sections for:
1. Featured 4 Main Categories
2. Popular Services Slider
3. Recommended Services Slider
4. "More Categories" Button

```javascript
// Add to home page JSX:

{/* Main Business Categories Section */}
<section className="py-12 px-4">
  <CategoryGrid
    title="Our Main Services"
    categories={mainCategories.slice(0, 4)}
  />
</section>

{/* Popular Services Slider */}
<section className="py-12 px-4">
  <ServiceSlider
    title="Popular Services"
    services={popularServices}
  />
</section>

{/* Recommended Services Slider */}
<section className="py-12 px-4">
  <ServiceSlider
    title="We Recommend"
    services={recommendedServices}
  />
</section>

{/* More Categories CTA */}
<section className="py-8 px-4 text-center">
  <Button
    size="lg"
    onClick={() => navigate('/lucid/services/all-categories')}
  >
    Explore All Categories →
  </Button>
</section>
```

#### Step 2.3: Create All Categories Page

**Create new file:** `src/pages/AllCategories.jsx`

```javascript
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_CATEGORIES } from '../data/mockCategories';
import { CategoryGrid } from '../components/CategoryGrid';
import { useNavigateBack } from '../hooks/useNavigateBack';

export default function AllCategories() {
  const handleBackClick = useNavigateBack('/lucid/', 300);

  // Group categories by type
  const mainCategories = MOCK_CATEGORIES.filter(c => c.tier === 'main');
  const popularCategories = MOCK_CATEGORIES.filter(c => c.tier === 'popular');
  const recommendedCategories = MOCK_CATEGORIES.filter(c => c.tier === 'recommended');
  const fullCategories = MOCK_CATEGORIES.filter(c => c.tier === 'full');

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="bg-primary text-white py-8 px-4">
        <button onClick={handleBackClick} className="mb-4">
          ← Back
        </button>
        <h1 className="text-4xl font-bold">All Service Categories</h1>
        <p className="text-primary/80">Find the perfect service for your needs</p>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 space-y-16">
        {/* Main Categories */}
        <CategoryGrid
          title="Main Categories"
          categories={mainCategories}
        />

        {/* Popular Categories */}
        <CategoryGrid
          title="Popular Services"
          categories={popularCategories}
        />

        {/* Recommended Categories */}
        <CategoryGrid
          title="Recommended for You"
          categories={recommendedCategories}
        />

        {/* All Other Categories */}
        <CategoryGrid
          title="More Categories"
          categories={fullCategories}
        />
      </div>
    </motion.div>
  );
}
```

---

### **PHASE 3: Routing & Navigation (Week 2)**

#### Step 3.1: Update Routes

**File:** `src/App.jsx`

Add new route:

```javascript
import AllCategories from './pages/AllCategories.jsx';

// In Routes component:
<Route path="/lucid/services/all-categories" element={<AllCategories />} />
```

#### Step 3.2: Update Navigation Links

**File:** `src/components/navbar.jsx`

Add link to all categories in navbar menu:

```javascript
// Add to navigation links:
{
  label: 'All Categories',
  to: '/lucid/services/all-categories',
  icon: FiGrid
}
```

---

### **PHASE 4: Service Discovery (Week 3)**

#### Step 4.1: Create Category Detail Page

**Create new file:** `src/pages/CategoryDetail.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_CATEGORIES } from '../data/mockCategories';
import { MOCK_SERVICES } from '../data/mockServices';
import ServiceCard from '../components/ServiceCard';

export default function CategoryDetail() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState(null);
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: 'rating',
    priceRange: [0, 1000],
  });

  useEffect(() => {
    // Find category
    const cat = MOCK_CATEGORIES.find(c => c.slug === category);
    setCategoryData(cat);

    // Find services in this category
    const categoryServices = MOCK_SERVICES.filter(
      s => s.categoryId === cat?.id
    );
    setServices(categoryServices);
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-primary text-white py-8 px-4">
        <h1 className="text-4xl font-bold">{categoryData?.name}</h1>
        <p>{categoryData?.description}</p>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Filters Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            {/* Filter Component */}
          </div>

          {/* Service List */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### Step 4.2: Update Services Route

**File:** `src/App.jsx`

Update existing route:

```javascript
// Before:
<Route path="/lucid/services/:category" element={<Category />} />

// After:
<Route path="/lucid/services/:category" element={<CategoryDetail />} />
```

---

### **PHASE 5: Mock Data Expansion (Week 3)**

#### Step 5.1: Expand Mock Providers

**File:** `src/data/mockProfiles.js`

Add service specializations to existing providers:

```javascript
// For each provider, add specializations array:
specializations: [
  {
    serviceId: 'svc-cleaning-home',
    serviceCategory: 'Cleaning',
    yearsOfExperience: 5,
    certifications: ['Health & Safety'],
    hourlyRate: 50,
  },
  {
    serviceId: 'svc-deep-cleaning',
    serviceCategory: 'Cleaning',
    yearsOfExperience: 3,
    certifications: [],
    hourlyRate: 75,
  }
]
```

#### Step 5.2: Create Provider-Service Mapping

**Create new file:** `src/data/mockProviderServices.js`

```javascript
// Maps which providers offer which services
export const PROVIDER_SERVICE_MAPPINGS = [
  {
    providerId: 'provider-1',
    services: ['svc-cleaning-home', 'svc-office-cleaning'],
    rating: 4.8,
    completedJobs: 250
  },
  // ... continue for all providers
];
```

---

## File Modifications Required

### **New Files to Create**

| File | Purpose |
|------|---------|
| `src/data/mockCategories.js` | All service categories |
| `src/data/mockServices.js` | Service listings with details |
| `src/data/mockProviderServices.js` | Provider-service mappings |
| `src/pages/AllCategories.jsx` | Full categories page |
| `src/pages/CategoryDetail.jsx` | Category with services |
| `src/components/CategoryGrid.jsx` | Category grid display |
| `src/components/ServiceCard.jsx` | Individual service card |
| `src/components/ServiceSlider.jsx` | Service carousel |

### **Files to Modify**

| File | Changes |
|------|---------|
| `src/App.jsx` | Add new routes |
| `src/pages/home.jsx` | Add category sections & sliders |
| `src/components/navbar.jsx` | Add all-categories link |
| `src/pages/Services.jsx` | Integrate with new structure |
| `src/data/mockProfiles.js` | Add specializations |

---

## Database Schema Updates

### **If using Supabase, create these tables:**

```sql
-- Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tier TEXT NOT NULL, -- 'main', 'popular', 'recommended', 'full'
  icon TEXT,
  position INTEGER,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Services Table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  average_price DECIMAL,
  price_min DECIMAL,
  price_max DECIMAL,
  popularity INTEGER DEFAULT 5,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Provider Specializations Table
CREATE TABLE provider_specializations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES profiles(id),
  service_id UUID REFERENCES services(id),
  years_of_experience INTEGER,
  certifications JSONB,
  hourly_rate DECIMAL,
  completed_jobs INTEGER DEFAULT 0,
  average_rating DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider_id, service_id)
);

-- Create Indexes
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_specializations_provider ON provider_specializations(provider_id);
CREATE INDEX idx_categories_tier ON categories(tier);
```

---

## Testing Checklist

### **Phase 1 Testing**

- [ ] Mock data loads correctly
- [ ] Categories display in correct tier order
- [ ] Services associated with correct categories
- [ ] Provider specializations load with profile data

### **Phase 2 Testing**

- [ ] Home page displays 4 main categories
- [ ] Popular services slider works
- [ ] Recommended services slider works
- [ ] "More Categories" button visible and clickable
- [ ] All category sections styled consistently

### **Phase 3 Testing**

- [ ] Navigation to all-categories page works
- [ ] All categories page displays all 12+ categories
- [ ] Categories organized by tier
- [ ] Responsive on mobile, tablet, desktop
- [ ] Back button returns to previous page

### **Phase 4 Testing**

- [ ] Category detail page loads correct services
- [ ] Service cards display properly
- [ ] Filters work (price range, sorting)
- [ ] Clicking service navigates to selected_service page
- [ ] Provider list shows specialists

### **Phase 5 Testing**

- [ ] Provider profile shows specializations
- [ ] Service-provider mappings accurate
- [ ] Booking form shows correct services
- [ ] Search/filter includes new categories
- [ ] No performance degradation

### **UI/UX Testing**

- [ ] Consistent theme colors used
- [ ] Smooth animations on page transitions
- [ ] Icons display correctly
- [ ] Mobile responsive layout
- [ ] No broken links or 404 errors
- [ ] Loading states work properly

### **Performance Testing**

- [ ] Page load time < 3 seconds
- [ ] Smooth scroll performance
- [ ] Slider animations smooth
- [ ] No console errors
- [ ] Images optimized

---

## Implementation Timeline

| Phase | Week | Tasks |
|-------|------|-------|
| **1** | Week 1 | Create mock data files, update profiles |
| **2** | Week 2 | Build components, update home page |
| **3** | Week 2 | Add routes, update navigation |
| **4** | Week 3 | Create category detail pages, filters |
| **5** | Week 3 | Expand mock data, test all integrations |
| **QA** | Week 4 | Full testing, bug fixes, optimization |

---

## Priority Roadmap

### **MVP (Minimum Viable Product)**
- [ ] 4 main categories on home
- [ ] All categories page
- [ ] Category detail with services
- [ ] Basic provider listings

### **Phase 2 (Enhanced)**
- [ ] Service filters (price, rating, distance)
- [ ] Provider specializations display
- [ ] Service reviews/ratings
- [ ] Saved favorites

### **Phase 3 (Advanced)**
- [ ] AI recommendations
- [ ] Booking history integration
- [ ] Service analytics dashboard
- [ ] Provider certification system

---

## Notes & Considerations

1. **Icon Management**: Use Lucide React icons for consistency
2. **Performance**: Implement lazy loading for category pages
3. **SEO**: Ensure category slugs are SEO-friendly
4. **Mobile**: Test all flows on mobile devices
5. **Accessibility**: Ensure WCAG 2.1 AA compliance
6. **Analytics**: Track which categories are most viewed
7. **Search**: Implement full-text search across services
8. **Scalability**: Design for adding 50+ categories in future

---

## Success Metrics

- [ ] All 4 main categories visible on home
- [ ] Popular services slider CTR > 5%
- [ ] All categories page loads < 2 seconds
- [ ] Category detail page conversion > 20%
- [ ] Provider specialization accuracy > 95%
- [ ] Zero 404 errors on category pages
- [ ] Mobile responsive on all devices

