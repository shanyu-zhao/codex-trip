'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Star, Calendar, ChevronLeft, ChevronRight, Heart, Mountain, Building, Sun, Waves } from 'lucide-react';
import { destinations } from '@/data/destinations';
import { Destination } from '@/types/destination';

const categoryIcons: Record<string, React.ReactNode> = {
  natural: <Mountain className='w-5 h-5' />,
  cultural: <Building className='w-5 h-5' />,
  urban: <Building className='w-5 h-5' />,
  beach: <Waves className='w-5 h-5' />,
};

const categoryNames: Record<string, string> = {
  natural: '自然风光',
  cultural: '人文古迹',
  urban: '城市景观',
  beach: '海滨度假',
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % destinations.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + destinations.length) % destinations.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className='min-h-screen'>
      {/* Hero Section with Carousel */}
      <section className='relative h-[500px] md:h-[600px]'>
        <div className='absolute inset-0 overflow-hidden'>
          {destinations.map((dest, index) => (
            <div
              key={dest.id}
              className={bsolute inset-0 transition-opacity duration-1000 }
            >
              <Image
                src={dest.coverImage}
                alt={dest.name}
                fill
                className='object-cover'
                priority={index === 0}
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className='absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors'
        >
          <ChevronLeft className='w-6 h-6 text-white' />
        </button>
        <button
          onClick={nextSlide}
          className='absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors'
        >
          <ChevronRight className='w-6 h-6 text-white' />
        </button>

        {/* Hero Content */}
        <div className='absolute bottom-0 left-0 right-0 p-8 md:p-16'>
          <div className='container mx-auto'>
            <h1 className='text-3xl md:text-5xl font-bold text-white mb-4'>
              {destinations[currentSlide].name}
            </h1>
            <p className='text-white/80 text-lg mb-4 max-w-2xl'>
              {destinations[currentSlide].description.slice(0, 100)}...
            </p>
            <div className='flex items-center gap-4 text-white/90 text-sm'>
              <span className='flex items-center gap-1'>
                <MapPin className='w-4 h-4' />
                {destinations[currentSlide].city}
              </span>
              <span className='flex items-center gap-1'>
                <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                {destinations[currentSlide].rating}
              </span>
            </div>
            <Link
              href={ /destination/}
              className='inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors'
            >
              查看详情
            </Link>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
          {destinations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={w-2 h-2 rounded-full transition-colors }
            />
          ))}
        </div>
      </section>

      {/* Search Section */}
      <section className='py-8 bg-white border-b'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
            <div className='relative w-full md:w-96'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                placeholder='搜索景点或城市...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50'
              />
            </div>
            <div className='flex flex-wrap gap-2'>
              <button
                onClick={() => setSelectedCategory('all')}
                className={px-4 py-2 rounded-full text-sm font-medium transition-colors }
              >
                全部
              </button>
              {Object.entries(categoryNames).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 }
                >
                  {categoryIcons[key]}
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section id='destinations' className='py-12'>
        <div className='container mx-auto px-4'>
          <h2 className='text-2xl font-bold mb-8'>热门目的地</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {filteredDestinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                isFavorite={favorites.includes(dest.id)}
                onToggleFavorite={() => toggleFavorite(dest.id)}
              />
            ))}
          </div>
          {filteredDestinations.length === 0 && (
            <div className='text-center py-12 text-gray-500'>
              <p className='text-lg'>未找到匹配的目的地</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function DestinationCard({
  destination,
  isFavorite,
  onToggleFavorite,
}: {
  destination: Destination;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <Link href={ /destination/} className='group'>
      <div className='bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border'>
        <div className='relative h-48 overflow-hidden'>
          <Image
            src={destination.coverImage}
            alt={destination.name}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite();
            }}
            className='absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors'
          >
            <Heart className={w-5 h-5 } />
          </button>
          <div className='absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-medium'>
            {categoryNames[destination.category]}
          </div>
        </div>
        <div className='p-4'>
          <h3 className='font-bold text-lg mb-2 group-hover:text-primary transition-colors'>
            {destination.name}
          </h3>
          <div className='flex items-center gap-3 text-sm text-gray-500 mb-3'>
            <span className='flex items-center gap-1'>
              <MapPin className='w-4 h-4' />
              {destination.city}
            </span>
            <span className='flex items-center gap-1'>
              <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
              {destination.rating}
            </span>
          </div>
          <div className='flex items-center gap-1 text-sm text-gray-400'>
            <Calendar className='w-4 h-4' />
            <span>最佳季节：{destination.bestSeason.join('、')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
