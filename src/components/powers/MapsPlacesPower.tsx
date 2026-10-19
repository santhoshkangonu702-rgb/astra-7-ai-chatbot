import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Search,
  Compass,
  Building,
  HeartPulse,
  GraduationCap,
  Utensils,
  Hotel,
  Fuel,
  Pill,
  Landmark,
  BookOpen,
  ShoppingBag,
  Train,
  Plane,
  AlertTriangle,
  Phone,
  Clock,
  Star,
  Share2,
  Bookmark,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { triggerHaptic, hapticAction, hapticSuccess } from '../../utils/haptics';

interface MapsPlacesPowerProps {
  onBack?: () => void;
  onAskAstra?: (prompt: string) => void;
}

export type PlaceCategory =
  | 'hospitals'
  | 'colleges'
  | 'restaurants'
  | 'hotels'
  | 'atms'
  | 'fuel'
  | 'pharmacies'
  | 'tourist'
  | 'libraries'
  | 'shopping'
  | 'transit'
  | 'emergency';

export interface PlaceItem {
  id: string;
  name: string;
  category: PlaceCategory;
  city: string;
  address: string;
  distanceKm: number;
  rating: number;
  reviewsCount: number;
  openingHours: string;
  phone: string;
  latitude: number;
  longitude: number;
  features: string[];
  isVerified: boolean;
}

const PLACES_DATABASE: PlaceItem[] = [
  // Hospitals
  {
    id: 'pl-aiims-delhi',
    name: 'All India Institute of Medical Sciences (AIIMS)',
    category: 'hospitals',
    city: 'New Delhi',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi, 110029',
    distanceKm: 2.4,
    rating: 4.8,
    reviewsCount: 14200,
    openingHours: '24/7 Emergency & Inpatient Operations',
    phone: '+91 11 2658 8500',
    latitude: 28.5672,
    longitude: 77.2100,
    features: ['Level 1 Trauma Center', 'Superspecialty Care', 'Ayushman Bharat Impaneled', 'Blood Bank'],
    isVerified: true
  },
  {
    id: 'pl-apollo-chennai',
    name: 'Apollo Hospital Greams Road',
    category: 'hospitals',
    city: 'Chennai',
    address: '21 Greams Lane, Thousand Lights, Chennai, 600006',
    distanceKm: 3.1,
    rating: 4.6,
    reviewsCount: 9800,
    openingHours: '24 Hours Emergency Service',
    phone: '+91 44 2829 0200',
    latitude: 13.0569,
    longitude: 80.2525,
    features: ['Cardiology Center of Excellence', 'Organ Transplant Facility', 'International Patient Wing'],
    isVerified: true
  },
  // Colleges & Universities
  {
    id: 'pl-iit-delhi',
    name: 'Indian Institute of Technology Delhi (IITD)',
    category: 'colleges',
    city: 'New Delhi',
    address: 'Hauz Khas, New Delhi, 110016',
    distanceKm: 4.2,
    rating: 4.9,
    reviewsCount: 6500,
    openingHours: 'Academic Hours: 08:30 – 17:30',
    phone: '+91 11 2659 7135',
    latitude: 28.5450,
    longitude: 77.1926,
    features: ['NIRF Rank 2 Engineering', 'AI & Computing Cluster', 'Research Park Incubation'],
    isVerified: true
  },
  {
    id: 'pl-iisc-blr',
    name: 'Indian Institute of Science (IISc)',
    category: 'colleges',
    city: 'Bengaluru',
    address: 'CV Raman Rd, Bengaluru, Karnataka, 560012',
    distanceKm: 5.0,
    rating: 4.9,
    reviewsCount: 8100,
    openingHours: 'Mon - Fri: 09:00 – 18:00',
    phone: '+91 80 2293 2001',
    latitude: 13.0219,
    longitude: 77.5671,
    features: ['Premier Scientific Research', 'Quantum Computing Labs', 'Center for Ecological Sciences'],
    isVerified: true
  },
  // Transit & Railway
  {
    id: 'pl-delhi-rail',
    name: 'New Delhi Railway Station (NDLS)',
    category: 'transit',
    city: 'New Delhi',
    address: 'Bhavbhuti Marg, Ratan Lal Market, New Delhi, 110006',
    distanceKm: 1.8,
    rating: 4.4,
    reviewsCount: 38000,
    openingHours: '24/7 Operations',
    phone: '139 (Indian Railways Helpline)',
    latitude: 28.6429,
    longitude: 77.2195,
    features: ['Vande Bharat Hub', 'Airport Express Metro Link', 'Executive Lounges', 'Luggage Cloakroom'],
    isVerified: true
  },
  {
    id: 'pl-secunderabad-rail',
    name: 'Secunderabad Junction Railway Station (SC)',
    category: 'transit',
    city: 'Hyderabad',
    address: 'Station Road, Secunderabad, Telangana, 500003',
    distanceKm: 3.5,
    rating: 4.5,
    reviewsCount: 22000,
    openingHours: '24/7 Operations',
    phone: '139',
    latitude: 17.4344,
    longitude: 78.5015,
    features: ['South Central Railway HQ', 'Direct Metro Connectivity', 'Platinum Green Station Certified'],
    isVerified: true
  },
  // Tourist & Monuments
  {
    id: 'pl-red-fort',
    name: 'Red Fort (Lal Qila)',
    category: 'tourist',
    city: 'New Delhi',
    address: 'Netaji Subhash Marg, Chandni Chowk, New Delhi, 110006',
    distanceKm: 3.8,
    rating: 4.6,
    reviewsCount: 65000,
    openingHours: '09:30 – 16:30 (Closed Mondays)',
    phone: '+91 11 2327 7705',
    latitude: 28.6562,
    longitude: 77.2410,
    features: ['UNESCO World Heritage Site', 'Mughal Architecture', 'Sound & Light Show', 'Archeological Museum'],
    isVerified: true
  },
  {
    id: 'pl-charminar',
    name: 'Charminar Monument & Mosque',
    category: 'tourist',
    city: 'Hyderabad',
    address: 'Char Kaman, Ghansi Bazaar, Hyderabad, Telangana, 500002',
    distanceKm: 4.1,
    rating: 4.6,
    reviewsCount: 54000,
    openingHours: '09:30 – 17:30 Daily',
    phone: '+91 40 2456 2222',
    latitude: 17.3616,
    longitude: 78.4747,
    features: ['Indo-Islamic Architectural Gem', 'Qutb Shahi Heritage', 'Laad Bazaar Pearl Market Adjacent'],
    isVerified: true
  }
];

export const MapsPlacesPower: React.FC<MapsPlacesPowerProps> = ({
  onBack,
  onAskAstra
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | 'all'>('all');
  const [searchCity, setSearchCity] = useState('New Delhi');
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('astra_saved_places');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activePlace, setActivePlace] = useState<PlaceItem | null>(PLACES_DATABASE[0]);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const categories: Array<{ id: PlaceCategory | 'all'; label: string; icon: React.ElementType }> = [
    { id: 'all', label: 'All Places', icon: Compass },
    { id: 'hospitals', label: 'Hospitals', icon: HeartPulse },
    { id: 'colleges', label: 'Colleges / Universities', icon: GraduationCap },
    { id: 'transit', label: 'Railway & Transit', icon: Train },
    { id: 'tourist', label: 'Tourist & Heritage', icon: Landmark },
    { id: 'restaurants', label: 'Food & Cafes', icon: Utensils },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'pharmacies', label: 'Pharmacies', icon: Pill },
    { id: 'fuel', label: 'Fuel & EV Stations', icon: Fuel }
  ];

  const handleRequestLocation = () => {
    triggerHaptic(12);
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser environment.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationPermissionGranted(true);
        setStatusNotice(`Device GPS Coordinates retrieved: Lat ${pos.coords.latitude.toFixed(2)}, Lon ${pos.coords.longitude.toFixed(2)}.`);
        hapticSuccess();
        setTimeout(() => setStatusNotice(null), 3000);
      },
      (err) => {
        setStatusNotice('Location access not granted. Using manual city search.');
        setTimeout(() => setStatusNotice(null), 3000);
      }
    );
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic(12);
    const updated = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
    setFavorites(updated);
    try {
      localStorage.setItem('astra_saved_places', JSON.stringify(updated));
    } catch {}
  };

  const filteredPlaces = useMemo(() => {
    return PLACES_DATABASE.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchCity =
        !searchCity.trim() ||
        p.city.toLowerCase().includes(searchCity.toLowerCase()) ||
        p.name.toLowerCase().includes(searchCity.toLowerCase()) ||
        p.address.toLowerCase().includes(searchCity.toLowerCase());
      return matchCat && matchCity;
    });
  }, [selectedCategory, searchCity]);

  return (
    <div
      id="astra-maps-places-power"
      className="w-full flex-1 flex flex-col bg-[#04060E] text-slate-100 min-h-0 min-w-0 overflow-y-auto"
      style={{ boxSizing: 'border-box' }}
    >
      {/* Top Header */}
      <div className="sticky top-0 z-20 border-b border-amber-500/20 bg-[#050814]/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                triggerHaptic(10);
                onBack();
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
              title="Return"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/40 text-amber-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                MAPS & PLACES INTELLIGENCE
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  Geo Spatial
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Nearby Hospitals, Colleges, Transit, Emergency, & Heritage Landmarks • Privacy Conscious
            </p>
          </div>
        </div>

        {/* Location Permission Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRequestLocation}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              locationPermissionGranted
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{locationPermissionGranted ? 'GPS Active' : 'Use Current Location'}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Status notice */}
        {statusNotice && (
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>{statusNotice}</span>
          </div>
        )}

        {/* Search Bar & Manual City Selector */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-sm space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Search city, area, or landmark (e.g. New Delhi, Hyderabad, Bengaluru)..."
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((c) => {
              const Icon = c.icon;
              const isSelected = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategory(c.id);
                    triggerHaptic(8);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-black font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Layout: List + Selected Place Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Places List */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Discovered Places ({filteredPlaces.length})
              </h3>
              <span className="text-xs text-slate-500">Verified coordinate pins</span>
            </div>

            <div className="space-y-3">
              {filteredPlaces.map((p) => {
                const isSelected = activePlace?.id === p.id;
                const isFav = favorites.includes(p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActivePlace(p);
                      triggerHaptic(8);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 shadow-md'
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/10'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-amber-300">
                          {p.category.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          ~{p.distanceKm} km away
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white truncate">{p.name}</h4>
                      <p className="text-xs text-slate-300 line-clamp-1">{p.address}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          {p.rating} <span className="text-slate-500 font-normal">({p.reviewsCount.toLocaleString()})</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {p.openingHours}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => toggleFavorite(p.id, e)}
                        className={`p-2 rounded-xl hover:bg-white/10 transition-colors ${
                          isFav ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title="Save Place"
                      >
                        <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Place Detailed Inspection Card & Directions */}
          <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm space-y-4 h-fit">
            {activePlace ? (
              <div className="space-y-4">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 uppercase">
                    {activePlace.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1.5">{activePlace.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{activePlace.address}</p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Operational Hours:</span>
                    <span className="text-white font-medium">{activePlace.openingHours}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Direct Contact:</span>
                    <a href={`tel:${activePlace.phone}`} className="text-amber-400 hover:underline">
                      {activePlace.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Coordinates:</span>
                    <span className="font-mono text-slate-300">{activePlace.latitude}, {activePlace.longitude}</span>
                  </div>
                </div>

                {/* Features & Amenities */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Key Facilities & Badges
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activePlace.features.map((f, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 text-[11px] text-slate-200 border border-white/10">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePlace.name + ' ' + activePlace.city)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Open Route & Turn-by-Turn Directions
                  </a>

                  {onAskAstra && (
                    <button
                      onClick={() => onAskAstra(`Tell me visiting guidelines, nearest parking, and history of: ${activePlace.name} in ${activePlace.city}`)}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      Ask Astra Travel Guide Details
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                Select a place from the list to preview details & directions.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
