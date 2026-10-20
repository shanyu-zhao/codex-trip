"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Star,
  Calendar,
  Clock,
  Ticket,
  Navigation,
  Hotel,
  Utensils,
  Route,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { getDestinationById, destinations } from "@/data/destinations";

const levelNames: Record<string, string> = { luxury: "豪华", mid: "舒适", budget: "经济" };

export default function DestinationPage() {
  const params = useParams();
  const id = params.id as string;
  const destination = getDestinationById(id);
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      const favs = JSON.parse(saved);
      setFavorites(favs);
      setIsFavorite(favs.includes(id));
    }
  }, [id]);

  const toggleFavorite = () => {
    const newFavorites = isFavorite
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    setIsFavorite(!isFavorite);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: destination?.name,
        text: destination?.description.slice(0, 100),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("链接已复制到剪贴板");
    }
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % (destination?.gallery.length || 1));
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + (destination?.gallery.length || 1)) % (destination?.gallery.length || 1));

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">未找到该景点</h1>
          <Link href="/" className="text-primary hover:underline">返回首页</Link>
        </div>
      </div>
    );
  }

  const relatedDestinations = destinations
    .filter((d) => d.id !== id && d.category === destination.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
          返回首页
        </Link>
      </div>

      <section className="container mx-auto px-4 mb-8">
        <div className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden cursor-pointer" onClick={() => setShowLightbox(true)}>
          <Image
            src={destination.gallery[currentImage]}
            alt={destination.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={toggleFavorite} className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors">
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-white"}`} />
            </button>
            <button onClick={handleShare} className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {destination.gallery.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setCurrentImage(index); }}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentImage ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{destination.name}</h1>
                  <p className="text-gray-500">{destination.nameEn}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{destination.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  {destination.city} · {destination.province}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-primary" />
                  最佳季节：{destination.bestSeason.join("、")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-primary" />
                  建议游玩：{destination.suggestedDuration}
                </span>
              </div>

              <p className="text-gray-700 leading-relaxed">{destination.description}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                门票信息
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">成人票</p>
                  <p className="text-2xl font-bold text-primary">￥{destination.ticketPrice.adult}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">学生票</p>
                  <p className="text-2xl font-bold text-primary">￥{destination.ticketPrice.student}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">老人票</p>
                  <p className="text-2xl font-bold text-primary">{destination.ticketPrice.elderly}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">开放时间</p>
                  <p className="text-sm font-medium">{destination.openingHours}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                交通指南
              </h2>
              <p className="text-gray-700 leading-relaxed">{destination.transportation}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Hotel className="w-5 h-5 text-primary" />
                住宿推荐
              </h2>
              <div className="space-y-3">
                {destination.accommodations.map((hotel, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="font-medium">{hotel.name}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      hotel.level === "luxury" ? "bg-purple-100 text-purple-700" :
                      hotel.level === "mid" ? "bg-blue-100 text-blue-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {levelNames[hotel.level]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                美食攻略
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {destination.foods.map((food, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-xl">
                    <p className="font-medium mb-1">{food.name}</p>
                    <p className="text-sm text-gray-500">{food.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Route className="w-5 h-5 text-primary" />
                推荐路线
              </h2>
              <div className="space-y-4">
                {destination.itinerary.oneDay && (
                  <div>
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">1</span>
                      一日游
                    </h3>
                    <div className="flex flex-wrap gap-2 ml-8">
                      {destination.itinerary.oneDay.map((spot, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">{spot}</span>
                      ))}
                    </div>
                  </div>
                )}
                {destination.itinerary.twoDays && (
                  <div>
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">2</span>
                      两日游
                    </h3>
                    <div className="space-y-2 ml-8">
                      {destination.itinerary.twoDays.map((day, index) => (
                        <p key={index} className="text-gray-600">{day}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                注意事项
              </h2>
              <ul className="space-y-2">
                {destination.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {relatedDestinations.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border">
                  <h3 className="font-bold mb-4">相关推荐</h3>
                  <div className="space-y-4">
                    {relatedDestinations.map((dest) => (
                      <Link key={dest.id} href={`/destination/${dest.id}`} className="block group">
                        <div className="relative h-32 rounded-xl overflow-hidden mb-2">
                          <Image
                            src={dest.coverImage}
                            alt={dest.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <p className="font-medium group-hover:text-primary transition-colors">{dest.name}</p>
                        <p className="text-sm text-gray-500">{dest.city}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setShowLightbox(false)}>
          <button className="absolute top-4 right-4 p-2 text-white hover:text-gray-300" onClick={() => setShowLightbox(false)}>
            <X className="w-8 h-8" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 p-2 text-white hover:text-gray-300">
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 p-2 text-white hover:text-gray-300">
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-4xl h-[70vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={destination.gallery[currentImage]}
              alt={destination.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
