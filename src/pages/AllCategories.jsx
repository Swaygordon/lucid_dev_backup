import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ALL_CATEGORIES } from '../data/categories';
import Breadcrumb from '../components/Breadcrumb';
import BackToTop from '../components/back_the_top_btn';
import LocationPicker from '../components/LocationPicker';
import { useSearchLocation, getLocationBackground, buildBackgroundStyle } from '../contexts/LocationContext';

const AllCategories = () => {
  const [query, setQuery] = React.useState('');
  const { searchLocation } = useSearchLocation();

  const filtered = query.trim()
    ? ALL_CATEGORIES.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()) ||
        c.services.some(s => s.name.toLowerCase().includes(query.toLowerCase()))
      )
    : ALL_CATEGORIES;

  const bgValue = getLocationBackground(searchLocation);
  const heroStyle = buildBackgroundStyle(bgValue);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero — background updates with active search location */}
      <div className="relative z-10 py-14 px-5 text-center" style={heroStyle}>
        {/* Subtle dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-1">All Services</h1>
          <p className="text-white/80 text-base md:text-lg mb-7">
            Find trusted service providers in{' '}
            <span className="font-semibold text-white">{searchLocation.area}</span>
            {searchLocation.region ? `, ${searchLocation.region}` : ''}
          </p>

          {/* Search bar + inline location picker */}
          <div className="max-w-xl mx-auto flex bg-white border border-gray-300 rounded-xl shadow-md">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search services..."
              className="flex-1 px-5 py-3 text-gray-900 outline-none text-base bg-transparent rounded-l-xl placeholder-gray-400"
            />
            <div className="flex items-center border-l border-gray-200">
              <LocationPicker inline />
            </div>
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-r-xl flex items-center gap-2 transition-colors flex-shrink-0"
            >
              <Search size={18} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-5 pt-5 pb-1">
        <Breadcrumb crumbs={[
          { label: 'Home', href: '/lucid/' },
          { label: 'All Services' },
        ]} />
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-5 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No services match &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(cat => {
              const Icon = cat.icon;
              return (
                <Link key={cat.id} to={`/lucid/services/${cat.slug}`}>
                  <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 group bg-white">
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className={`absolute top-4 left-4 w-11 h-11 rounded-xl ${cat.color} flex items-center justify-center shadow-sm`}>
                        <Icon size={20} className={cat.iconColor} />
                      </div>
                    </div>
                    {/* Text */}
                    <div className="p-5">
                      <h3 className="text-base font-bold text-gray-900 mb-1">{cat.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{cat.description}</p>
                      <p className="text-xs text-blue-600 font-medium">
                        {cat.services.length} services available
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <BackToTop />
    </div>
  );
};

export default AllCategories;
