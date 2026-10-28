import React from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { useCity } from '../context/CityContext';

export default function CityModal() {
  const { isCityModalOpen, setIsCityModalOpen, selectedCity, changeCity, cities } = useCity();

  if (!isCityModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Select Your City</h3>
              <p className="text-xs text-slate-400">Discover theatres and shows near you</p>
            </div>
          </div>
          <button
            onClick={() => setIsCityModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 gap-3 pt-5">
          {cities.map((city) => {
            const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.name}
                onClick={() => changeCity(city.name)}
                className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all duration-200 ${
                  isSelected
                    ? 'bg-red-600/20 border-red-500 text-white shadow-glow'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{city.icon}</span>
                  <div>
                    <p className="text-xs font-bold">{city.name}</p>
                    <p className="text-[10px] text-slate-400">{city.state}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-red-500" />}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
