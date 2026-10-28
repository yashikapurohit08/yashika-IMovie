import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Phone, Calendar, Shield, Ticket, Check, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import AlertToast from '../components/AlertToast';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [city, setCity] = useState(user?.city || 'New York');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState(null);
  const [stats, setStats] = useState({ totalBookings: 0, totalSpent: 0 });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCity(user.city || 'New York');
      setPhone(user.phone || '');
    }

    const loadStats = async () => {
      try {
        const res = await api.getMyBookings();
        if (res.success && res.bookings) {
          const totalBookings = res.bookings.length;
          const totalSpent = res.bookings
            .filter(b => b.bookingStatus === 'CONFIRMED')
            .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
          setStats({ totalBookings, totalSpent });
        }
      } catch (e) {}
    };

    loadStats();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setAlert(null);
      await updateProfile({ name, city, phone });
      setAlert({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 pb-24">
      
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-700 to-red-500 text-white flex items-center justify-center font-black text-2xl uppercase shadow-glow flex-shrink-0">
          {user?.name ? user.name[0] : 'U'}
        </div>
        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black text-white">{user?.name}</h1>
            {user?.role === 'admin' ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                <Shield className="w-3 h-3" /> ADMINISTRATOR
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                MEMBER
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">{user?.email}</p>
          <p className="text-[11px] text-slate-500 flex items-center justify-center sm:justify-start gap-1 pt-1">
            <Calendar className="w-3.5 h-3.5" />
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '2026'}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Lifetime Bookings</span>
          <p className="text-2xl font-black text-white">{stats.totalBookings}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Cinema Spending</span>
          <p className="text-2xl font-black text-emerald-400">${stats.totalSpent.toFixed(2)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 font-medium">Preferred Cinema City</span>
          <p className="text-2xl font-black text-red-500">{user?.city || 'New York'}</p>
        </div>
      </div>

      {alert && (
        <AlertToast message={alert.message} type={alert.type} onClose={() => setAlert(null)} />
      )}

      {/* Edit Profile Form */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white">Account Information</h2>
          <p className="text-xs text-slate-400">Update your contact details and default cinema preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Email (Read only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address (Primary)</label>
              <div className="relative">
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-500 cursor-not-allowed"
                />
                <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Preferred City */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Preferred City</label>
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                  <option value="Toronto">Toronto</option>
                  <option value="London">London</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Phone Number (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              </div>
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-glow flex items-center gap-2 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
