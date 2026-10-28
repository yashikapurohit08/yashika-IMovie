import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, AlertTriangle, Popcorn, Plus, Minus, Lock } from 'lucide-react';

const SNACKS_MENU = [
  { id: 'snack-1', name: 'Caramel Cinema Popcorn (L)', price: 8.5, desc: 'Freshly popped with rich salted caramel' },
  { id: 'snack-2', name: 'Chilled Pepsi Zero (M)', price: 4.5, desc: 'Ice cold fountain beverage' },
  { id: 'snack-3', name: 'Nachos with Warm Jalapeño Cheese', price: 7.0, desc: 'Crispy corn tortilla with creamy dip' },
  { id: 'snack-4', name: 'Artisan Gourmet Pretzel', price: 6.0, desc: 'Oven-baked with honey mustard' }
];

export default function BookingSummaryModal({
  isOpen,
  onClose,
  show,
  selectedSeats = [],
  seatDetails = [],
  subtotal = 0,
  onConfirmBooking,
  isProcessing = false
}) {
  if (!isOpen || !show) return null;

  const [quantities, setQuantities] = useState({
    'snack-1': 0,
    'snack-2': 0,
    'snack-3': 0,
    'snack-4': 0
  });

  const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card (Mock)');
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const handleQtyChange = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  // Calculate snacks total
  const selectedSnacks = SNACKS_MENU.filter(s => quantities[s.id] > 0).map(s => ({
    id: s.id,
    name: s.name,
    quantity: quantities[s.id],
    price: s.price
  }));

  const snacksTotal = selectedSnacks.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const convenienceFee = Number((selectedSeats.length * 1.5).toFixed(2));
  const taxes = Number(((subtotal + snacksTotal + convenienceFee) * 0.08).toFixed(2));
  const finalTotal = Number((subtotal + snacksTotal + convenienceFee + taxes).toFixed(2));

  const handlePay = () => {
    onConfirmBooking({
      snacks: selectedSnacks,
      paymentMethod,
      simulateFailure
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h3 className="text-lg font-black text-white">Order Summary & Payment</h3>
            <p className="text-xs text-slate-400">Review your ticket details before checkout</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Show Details Banner */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex gap-4">
            <img
              src={show.movie?.poster}
              alt={show.movie?.title}
              className="w-16 h-24 object-cover rounded-xl"
            />
            <div className="flex-1 space-y-1">
              <h4 className="text-base font-bold text-white line-clamp-1">{show.movie?.title}</h4>
              <p className="text-xs text-red-400 font-semibold">{show.theatre?.name} • {show.screen?.screenName}</p>
              <p className="text-xs text-slate-300">
                {show.showDate} at <span className="font-bold text-white">{show.startTime}</span>
              </p>
              <div className="pt-1 flex flex-wrap gap-1">
                {selectedSeats.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Cinema Snacks Add-on */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Popcorn className="w-4 h-4 text-amber-400" />
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Add Concessions & Snacks (Optional)
              </h5>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SNACKS_MENU.map(snack => {
                const count = quantities[snack.id] || 0;
                return (
                  <div key={snack.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div className="space-y-0.5 pr-2">
                      <p className="text-xs font-semibold text-white">{snack.name}</p>
                      <p className="text-[10px] text-amber-400 font-bold">${snack.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {count > 0 && (
                        <>
                          <button
                            onClick={() => handleQtyChange(snack.id, -1)}
                            className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white w-4 text-center">{count}</span>
                        </>
                      )}
                      <button
                        onClick={() => handleQtyChange(snack.id, 1)}
                        className="w-6 h-6 rounded-md bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-xs shadow-glow"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Payment Method (Development Simulation)
            </h5>
            <div className="grid grid-cols-3 gap-2">
              {['Credit/Debit Card (Mock)', 'Apple / Google Pay', 'UPI / NetBanking'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-xl text-xs font-semibold border text-center transition ${
                    paymentMethod === method
                      ? 'bg-red-600/20 border-red-500 text-white shadow-glow'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            {/* Simulated Card Form */}
            <div className="mt-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-medium text-slate-300">
                  <CreditCard className="w-3.5 h-3.5 text-red-500" /> Simulated Card Details
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                  Sandbox Active
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="col-span-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  placeholder="Card Number"
                />
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white text-center"
                    placeholder="MM/YY"
                  />
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-1/2 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white text-center"
                    placeholder="CVV"
                  />
                </div>
              </div>
            </div>

            {/* Test Simulation Controls: Success / Failure Toggle */}
            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">Payment Outcome Simulation</p>
                <p className="text-[10px] text-slate-400">
                  Toggle to test failure handling as specified in project requirements
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-red-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className={simulateFailure ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {simulateFailure ? 'Simulate Decline' : 'Simulate Success'}
                </span>
              </label>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Tickets ({selectedSeats.length} seats)</span>
              <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
            </div>
            {snacksTotal > 0 && (
              <div className="flex justify-between text-slate-400">
                <span>Food & Beverages ({selectedSnacks.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold text-white">${snacksTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Convenience Fee ($1.50/seat)</span>
              <span className="font-semibold text-white">${convenienceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Estimated Taxes (8%)</span>
              <span className="font-semibold text-white">${taxes.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
              <span className="font-bold text-white">Grand Total Amount</span>
              <span className="text-xl font-black text-red-500">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-Bit SSL Encrypted Mock Gateway</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePay}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-glow hover:shadow-glow-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pay ${finalTotal.toFixed(2)} & Confirm</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
