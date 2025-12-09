import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import { CURRENT_USER, MOCK_KPI, MOCK_JOBS, MOCK_INVENTORY, MOCK_PO, MOCK_LOGS } from './constants';
import { Role, StockStatus, JobStatus } from './types';
import { analyzeInventoryRisks } from './services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Search, Filter, Plus, BrainCircuit, AlertOctagon, ShieldCheck } from 'lucide-react';

// --- Dashboard View ---
const DashboardView = () => {
  const data = [
    { name: 'Jan', revenue: 40000, cost: 24000 },
    { name: 'Feb', revenue: 30000, cost: 13980 },
    { name: 'Mar', revenue: 20000, cost: 9800 },
    { name: 'Apr', revenue: 27800, cost: 39080 },
    { name: 'May', revenue: 18900, cost: 4800 },
    { name: 'Jun', revenue: 23900, cost: 3800 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_KPI.map((kpi, index) => (
          <StatCard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue vs Operational Cost</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F59E0B" fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="cost" stroke="#6366f1" fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-6">Job Status Distribution</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pending', value: 4 },
                    { name: 'In Progress', value: 12 },
                    { name: 'QC', value: 3 },
                    { name: 'Completed', value: 25 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#64748b" />
                  <Cell fill="#3b82f6" />
                  <Cell fill="#eab308" />
                  <Cell fill="#22c55e" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-500"></div> Pending</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Active</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Work Order View ---
const WorkOrderView = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Work Order Management</h2>
        <button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/20">
          <Plus size={18} /> New Job Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MOCK_JOBS.map((job) => (
          <div key={job.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors group relative overflow-hidden">
             {/* Status Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
              job.status === JobStatus.COMPLETED ? 'bg-emerald-500' : 
              job.status === JobStatus.IN_PROGRESS ? 'bg-blue-500' :
              job.status === JobStatus.QUALITY_CHECK ? 'bg-purple-500' : 'bg-slate-500'
            }`}></div>
            
            <div className="flex justify-between items-start mb-3 pl-3">
              <span className="text-xs font-mono text-slate-500">{job.id}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                 job.status === JobStatus.COMPLETED ? 'bg-emerald-500/10 text-emerald-400' : 
                 job.status === JobStatus.IN_PROGRESS ? 'bg-blue-500/10 text-blue-400' :
                 'bg-slate-700 text-slate-300'
              }`}>
                {job.status}
              </span>
            </div>
            
            <h3 className="text-white font-semibold text-lg pl-3 mb-1">{job.vehicle}</h3>
            <p className="text-slate-400 text-sm pl-3 mb-4">{job.description}</p>
            
            <div className="pl-3 space-y-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Customer</span>
                <span className="text-slate-300">{job.customer}</span>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Progress</span>
                  <span>{job.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${job.progress}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Inventory View ---
const InventoryView = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisResult(null);
    const result = await analyzeInventoryRisks(MOCK_INVENTORY);
    setAnalysisResult(result);
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white">Inventory & Spare Parts</h2>
           <p className="text-sm text-slate-400 mt-1">Real-time stock tracking across Warehouse A & B</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleAnalysis}
            disabled={analyzing}
            className="border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            {analyzing ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></span> : <BrainCircuit size={18} />}
            {analyzing ? 'Gemini Analyzing...' : 'AI Anomaly Detection'}
          </button>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-slate-700">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      {analysisResult && (
        <div className="bg-slate-900/50 border border-indigo-500/30 rounded-xl p-6 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
          <div className="flex items-start gap-4">
             <div className="p-3 bg-indigo-500/20 rounded-lg">
                <BrainCircuit className="text-indigo-400" size={24} />
             </div>
             <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Gemini Insight Report</h3>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">{analysisResult.summary}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                     <span className="text-xs text-slate-500 uppercase tracking-wider">Risk Level</span>
                     <p className={`text-xl font-bold mt-1 ${analysisResult.riskLevel === 'High' ? 'text-red-400' : 'text-emerald-400'}`}>{analysisResult.riskLevel}</p>
                  </div>
                  <div className="col-span-2 bg-slate-950 p-4 rounded-lg border border-slate-800">
                    <span className="text-xs text-slate-500 uppercase tracking-wider">Detected Anomalies</span>
                    <ul className="mt-2 space-y-2">
                      {analysisResult.anomalies.map((a: any, i: number) => (
                        <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                           <AlertOctagon size={14} className="text-amber-500" />
                           <span className="font-mono text-amber-500/80">[{a.itemId}]</span> {a.issue}
                        </li>
                      ))}
                      {analysisResult.anomalies.length === 0 && <li className="text-sm text-slate-500 italic">No critical anomalies detected.</li>}
                    </ul>
                  </div>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="p-4">Item Details</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Location</th>
              <th className="p-4 text-right">Stock Level</th>
              <th className="p-4 text-right">Unit Price</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {MOCK_INVENTORY.map((item) => {
              const stockStatus = item.quantity <= item.minLevel ? StockStatus.LOW_STOCK : StockStatus.IN_STOCK;
              return (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="p-4">
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-xs text-slate-500">ID: {item.id}</p>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-sm">{item.sku}</td>
                  <td className="p-4 text-slate-400 text-sm">{item.location}</td>
                  <td className="p-4 text-right font-medium text-white">
                    {item.quantity} <span className="text-slate-500 text-xs font-normal">/ {item.minLevel} min</span>
                  </td>
                  <td className="p-4 text-right text-slate-300">${item.price.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      stockStatus === StockStatus.LOW_STOCK ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {stockStatus === StockStatus.LOW_STOCK && <AlertTriangle size={12} className="mr-1" />}
                      {stockStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-slate-500 hover:text-amber-400 transition-colors text-sm">Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Security View ---
const SecurityView = () => {
  return (
    <div className="space-y-6">
       <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
         <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-slate-800 rounded-lg text-amber-500">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Security Audit Log</h2>
              <p className="text-slate-400 text-sm">Defense in Depth: Monitoring RBAC and Transaction Anomalies</p>
            </div>
         </div>
         
         <div className="space-y-4">
           {MOCK_LOGS.map((log) => (
             <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg bg-slate-950/50 border border-slate-800/50 hover:border-slate-700 transition-colors">
                <div className={`mt-1 w-2 h-2 rounded-full ${
                  log.severity === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                  log.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-slate-200 text-sm">{log.action}</p>
                    <span className="text-xs text-slate-500 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{log.details}</p>
                  <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-wide">User: <span className="text-slate-300">{log.user}</span></p>
                </div>
             </div>
           ))}
         </div>
       </div>
    </div>
  )
}

// --- Placeholder Views ---
const SimpleView = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-96 border-2 border-dashed border-slate-800 rounded-xl text-slate-500">
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm">Module coming in Phase 2 Rollout</p>
    </div>
  </div>
);

// --- Main Layout ---
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardView />;
      case 'workorders': return <WorkOrderView />;
      case 'inventory': return <InventoryView />;
      case 'purchasing': return <SimpleView title="Purchasing Management" />;
      case 'accounting': return <SimpleView title="Accounting & Finance" />;
      case 'security': return <SecurityView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <Sidebar 
        currentUser={CURRENT_USER} 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
      />
      
      <main className="flex-1 ml-64 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex justify-between items-center">
          <h2 className="text-lg font-medium text-white capitalize">{currentPage.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
               <input 
                type="text" 
                placeholder="Global Search..." 
                className="bg-slate-900 border border-slate-700 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-amber-500 text-slate-300 w-64 placeholder:text-slate-600 transition-all"
               />
             </div>
             <button className="p-2 text-slate-400 hover:text-white relative">
               <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
               <AlertTriangle size={20} />
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto pb-20">
          {renderPage()}
        </div>

        {/* Footer (Agile/Phased note) */}
        <div className="fixed bottom-0 right-0 left-64 bg-slate-950 border-t border-slate-800 px-8 py-2 text-xs text-slate-600 flex justify-between">
           <span>AURUM ERP v1.0.0 (Alpha)</span>
           <span>Agile Phase 1: Core Modules & AI Integ.</span>
        </div>
      </main>
    </div>
  );
};

export default App;