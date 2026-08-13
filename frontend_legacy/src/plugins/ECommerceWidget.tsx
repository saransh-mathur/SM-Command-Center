import React from 'react';
import { ShoppingCart, TrendingUp, Package, DollarSign } from 'lucide-react';

export const ECommerceWidget = () => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
          <ShoppingCart className="w-4 h-4 text-cyan-400" />
          <span>E-COMMERCE FULFILLMENT</span>
        </div>
        <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full">Syncing Excel</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-[#09090b] p-3 rounded-md border border-zinc-800/40 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] mb-1">
              <Package className="w-3 h-3 text-emerald-400" /> Shipped Today
            </div>
            <div className="text-sm font-bold text-zinc-200">142 Orders</div>
          </div>
          <div className="text-emerald-400 text-xs font-bold bg-emerald-500/10 p-1.5 rounded-md">+12%</div>
        </div>
        
        <div className="bg-[#09090b] p-3 rounded-md border border-zinc-800/40 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] mb-1">
              <TrendingUp className="w-3 h-3 text-amber-400" /> Pending
            </div>
            <div className="text-sm font-bold text-zinc-200">38 Orders</div>
          </div>
          <div className="text-amber-400 text-xs font-bold bg-amber-500/10 p-1.5 rounded-md">Pack Now</div>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-3 rounded-md border border-emerald-500/20 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-400 tracking-wider">TODAY'S REVENUE</span>
        </div>
        <div className="text-2xl font-black text-zinc-100">$4,250.00</div>
        <div className="text-[10px] text-zinc-400 mt-1">Profit Margin: 32% | AOV: $65.20</div>
      </div>
    </>
  );
};
