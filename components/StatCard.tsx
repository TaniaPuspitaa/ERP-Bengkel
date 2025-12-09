import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend: number;
  trendUp: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendUp }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100"></div>
      
      <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
      <h3 className="text-2xl font-bold text-white tracking-tight mb-4">{value}</h3>
      
      <div className="flex items-center gap-2">
        <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {trendUp ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
          {trend}%
        </span>
        <span className="text-slate-500 text-xs">vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;
