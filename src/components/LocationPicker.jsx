import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, RotateCcw } from 'lucide-react';
import { useSearchLocation, GHANA_LOCATIONS } from '../contexts/LocationContext';

// inline=true  → just a MapPin icon, designed to sit inside a unified search bar
// inline=false → standalone pill button (original style, kept for future use)
export default function LocationPicker({ inline = false }) {
  const { searchLocation, defaultLocation, changeSearchLocation, resetToDefault } = useSearchLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);

  const isDefault = searchLocation.area === defaultLocation.area;

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Filter groups by search query
  const filteredGroups = query.trim()
    ? GHANA_LOCATIONS.map(g => ({
        ...g,
        areas: g.areas.filter(a => a.toLowerCase().includes(query.toLowerCase())),
      })).filter(g => g.areas.length > 0)
    : GHANA_LOCATIONS;

  function handleSelect(area) {
    changeSearchLocation(area);
    setOpen(false);
    setQuery('');
  }

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      {inline ? (
        /* ── Inline variant: icon only, sits inside a search bar ── */
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          title={`Searching in: ${searchLocation.area}`}
          className="relative flex items-center justify-center w-10 h-full text-gray-400 hover:text-blue-600 transition-colors"
        >
          <MapPin className="w-5 h-5" />
          {!isDefault && (
            <span className="absolute top-2 right-1.5 w-1.5 h-1.5 rounded-full bg-orange-400" />
          )}
        </button>
      ) : (
        /* ── Standalone variant: pill button ── */
        <button
          type="button"
          onClick={() => setOpen(prev => !prev)}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-colors shadow-sm whitespace-nowrap"
        >
          <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="max-w-[110px] truncate font-medium">
            {searchLocation.area || 'Set location'}
          </span>
          {!isDefault && (
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" title="Not your home location" />
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Dropdown — inline mode aligns to right edge so it doesn't overflow the viewport */}
      {open && (
        <div className={`absolute top-full mt-1.5 z-50 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden ${inline ? 'right-0' : 'left-0'}`}>
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search locations..."
              className="w-full px-3 py-1.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
              autoFocus
            />
          </div>

          {/* Reset to account default */}
          {!isDefault && (
            <button
              onClick={() => { resetToDefault(); setOpen(false); setQuery(''); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border-b border-gray-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back to my location <span className="font-semibold">({defaultLocation.area})</span></span>
            </button>
          )}

          {/* Location list — scrollable */}
          <div className="max-h-64 overflow-y-auto">
            {filteredGroups.length === 0 ? (
              <p className="px-4 py-4 text-sm text-gray-400 text-center">No locations found</p>
            ) : (
              filteredGroups.map(group => (
                <div key={group.region}>
                  <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {group.region}
                  </p>
                  {group.areas.map(area => (
                    <button
                      key={area}
                      onClick={() => handleSelect(area)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                        searchLocation.area === area
                          ? 'text-blue-600 font-semibold bg-blue-50'
                          : 'text-gray-700'
                      }`}
                    >
                      <span>{area}</span>
                      {area === defaultLocation.area && (
                        <span className="text-xs text-gray-400 font-normal">my location</span>
                      )}
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer hint */}
          <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              Changing location won&apos;t update your account settings
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
