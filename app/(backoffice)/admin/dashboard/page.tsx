'use client';

import Link from 'next/link';

// Mock Data
const kpis = [
  { title: "Total Revenue", value: "TZS 4,280,000", trend: "+12.5%", isPositive: true },
  { title: "Total Orders", value: "248", trend: "+8.2%", isPositive: true },
  { title: "Total Customers", value: "1,042", trend: "+5.1%", isPositive: true },
  { title: "Avg. Order Value", value: "TZS 17,258", trend: "-1.4%", isPositive: false },
];

const recentOrders = [
  { id: 'ORD-00123', customer: 'Alice Johnson', email: 'alice@example.com', items: 3, total: 'TZS 14,500', payment: 'Paid', status: 'Processing', date: '22 Mar 2026' },
  { id: 'ORD-00124', customer: 'Bob Smith', email: 'bob@example.com', items: 1, total: 'TZS 45,000', payment: 'Pending', status: 'Pending', date: '22 Mar 2026' },
  { id: 'ORD-00125', customer: 'Catherine Lee', email: 'cat@example.com', items: 5, total: 'TZS 120,000', payment: 'Paid', status: 'Shipped', date: '21 Mar 2026' },
  { id: 'ORD-00126', customer: 'David Kim', email: 'david@example.com', items: 2, total: 'TZS 28,000', payment: 'Refunded', status: 'Cancelled', date: '20 Mar 2026' },
  { id: 'ORD-00127', customer: 'Elias Mtega', email: 'mtega@example.com', items: 1, total: 'TZS 117,000', payment: 'Paid', status: 'Delivered', date: '19 Mar 2026' },
];

const topProducts = [
  { name: 'Executive Diary', sold: 142, revenue: 'TZS 1,600,000' },
  { name: 'Ergonomic Office Chair', sold: 45, revenue: 'TZS 980,000' },
  { name: 'Premium Pen Drop', sold: 88, revenue: 'TZS 750,000' },
];

const lowStock = [
  { name: 'Wireless Mouse Array', stock: 4 },
  { name: 'High-Yield Print Toner', stock: 2 },
  { name: 'Scientific Calculator', stock: 8 },
];

// Refined Premium Badge System
const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'Paid': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
    'Pending': 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
    'Refunded': 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20',
    'Processing': 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
    'Shipped': 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20',
    'Delivered': 'bg-teal-50 text-teal-700 ring-1 ring-teal-600/20',
    'Cancelled': 'bg-red-50 text-red-700 ring-1 ring-red-600/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${styles[status] || 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/10'}`}>
      {status}
    </span>
  );
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-16 max-w-[1600px] mx-auto">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-r from-white to-transparent p-6 rounded-3xl border border-gray-100/50 shadow-[0_2px_40px_rgb(0,0,0,0.02)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/3"></div>
        <div>
          <h1 className="text-4xl font-extrabold text-[#18202D] font-heading tracking-tight">Overview Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base font-medium">Welcome back to Globs-By Admin. Here's your enterprise system status.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-white border border-gray-200/80 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Last 30 Days
          </button>
          <button className="flex-1 md:flex-none justify-center items-center gap-2 px-5 py-2.5 bg-[#18202D] text-white rounded-xl text-sm font-semibold hover:bg-[#253040] hover:shadow-md transition-all shadow-sm flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Row - Elevated Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="group relative bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden">
            {/* Subtle Gradient Backdrop indicator */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-accent' : 'bg-orange-500'} -translate-y-1/2 translate-x-1/2`}></div>
            
            <h3 className="text-sm font-semibold text-gray-500 tracking-wide">{kpi.title}</h3>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-3xl font-extrabold text-[#18202D] tracking-tight">{kpi.value}</span>
              <div className={`flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full ${kpi.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {kpi.isPositive ? <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>}
                <span>{kpi.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytical Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Advanced Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 relative flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="font-heading font-bold text-xl text-[#18202D]">Revenue Analytics</h3>
              <p className="text-sm text-muted-foreground mt-1">Daily gross volume across all sales channels</p>
            </div>
            <div className="flex bg-gray-50/80 rounded-xl p-1 border border-gray-100">
              {['7D', '30D', '90D', '1Y'].map(d => (
                <button key={d} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${d === '30D' ? 'bg-white shadow-sm ring-1 ring-gray-900/5 text-[#18202D]' : 'text-gray-500 hover:text-gray-900'}`}>{d}</button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 relative min-h-[300px] w-full mt-4 border-b border-gray-100 flex items-end">
             {/* Premium Line Graph Mock Using SVG */}
             <svg viewBox="0 0 800 250" preserveAspectRatio="none" className="w-full h-full absolute inset-0 text-accent overflow-visible">
               {/* Background Grid */}
               <line x1="0" y1="50" x2="800" y2="50" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
               <line x1="0" y1="125" x2="800" y2="125" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
               <line x1="0" y1="200" x2="800" y2="200" stroke="#f3f4f6" strokeWidth="1" strokeDasharray="4 4" />
               
               {/* Linear Gradient Fill */}
               <defs>
                 <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.3"/>
                   <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
                 </linearGradient>
               </defs>
               
               {/* The Line Area */}
               <path d="M0,250 L0,180 C100,200 150,80 250,110 C350,140 400,190 500,150 C600,110 650,40 800,90 L800,250 Z" fill="url(#chartGradient)" />
               
               {/* The Stroke */}
               <path d="M0,180 C100,200 150,80 250,110 C350,140 400,190 500,150 C600,110 650,40 800,90" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
               
               {/* Data Points */}
               <circle cx="250" cy="110" r="5" fill="#fff" stroke="currentColor" strokeWidth="3" className="hover:r-[8px] transition-all cursor-pointer" />
               <circle cx="500" cy="150" r="5" fill="#fff" stroke="currentColor" strokeWidth="3" className="hover:r-[8px] transition-all cursor-pointer" />
               <circle cx="800" cy="90" r="5" fill="#fff" stroke="currentColor" strokeWidth="3" className="hover:r-[8px] transition-all cursor-pointer" />
             </svg>

             {/* Axis Labels */}
             <div className="absolute left-0 -translate-x-full top-[30px] pr-4 text-[11px] font-semibold text-gray-400">100k</div>
             <div className="absolute left-0 -translate-x-full top-[105px] pr-4 text-[11px] font-semibold text-gray-400">50k</div>
             <div className="absolute left-0 -translate-x-full top-[180px] pr-4 text-[11px] font-semibold text-gray-400">0</div>
          </div>
          
          <div className="flex justify-between w-full mt-4 text-[11px] font-semibold text-gray-400 uppercase tracking-widest pl-2">
            <span>Mar 1</span>
            <span>Mar 8</span>
            <span>Mar 15</span>
            <span>Mar 22</span>
            <span>Mar 31</span>
          </div>
        </div>

        {/* Orders by Status Donut */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex flex-col items-center relative overflow-hidden">
          <div className="w-full text-left mb-8 z-10">
            <h3 className="font-heading font-bold text-xl text-[#18202D]">Orders by Status</h3>
            <p className="text-sm text-muted-foreground mt-1">Live fulfillment tracking</p>
          </div>
          
          <div className="relative w-56 h-56 flex items-center justify-center z-10 my-4">
             {/* Dynamic SVG Donut Chart */}
             <svg className="w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="16" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="100.48" className="transition-all duration-1000" /> {/* Delivered (60%) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="200.96" className="transition-all duration-1000" /> {/* Processing (20%) */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="226.08" className="transition-all duration-1000" /> {/* Pending (10%) */}
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-white m-[22px] rounded-full shadow-inner">
               <span className="text-4xl font-black text-[#18202D] tracking-tighter">248</span>
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total</span>
             </div>
          </div>

          <div className="w-full mt-8 space-y-4 px-2 z-10 flex-1 flex flex-col justify-end">
             <div className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                 <span className="text-sm font-semibold text-gray-700">Delivered</span>
               </div>
               <span className="font-bold text-[#18202D]">164</span>
             </div>
             <div className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                 <span className="text-sm font-semibold text-gray-700">Processing</span>
               </div>
               <span className="font-bold text-[#18202D]">42</span>
             </div>
             <div className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                 <span className="text-sm font-semibold text-gray-700">Pending</span>
               </div>
               <span className="font-bold text-[#18202D]">42</span>
             </div>
          </div>
        </div>

      </div>

      {/* Recent Orders Massive Block */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
        <div className="p-8 border-b border-gray-100 flex justify-between items-end bg-gradient-to-b from-gray-50/50 to-white">
          <div>
            <h3 className="font-heading font-bold text-xl text-[#18202D]">Recent Orders</h3>
            <p className="text-sm text-muted-foreground mt-1">Your latest 5 transactions across all channels</p>
          </div>
          <Link href="/admin/orders" className="text-sm font-bold text-primary group flex items-center gap-2 hover:text-accent transition-colors">
            View All Orders <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
        </div>
        <div className="overflow-x-auto p-4 sm:p-6 lg:p-8 pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-100 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                <th className="px-4 py-5">Order ID</th>
                <th className="px-4 py-5">Customer Profile</th>
                <th className="px-4 py-5">Volume</th>
                <th className="px-4 py-5 font-extrabold text-[#18202D]">Total</th>
                <th className="px-4 py-5">Payment</th>
                <th className="px-4 py-5">Status</th>
                <th className="px-4 py-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80 bg-white">
              {recentOrders.map((order, i) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                  <td className="px-4 py-6">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-accent hover:underline font-bold text-sm bg-accent/5 px-2 py-1 rounded">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm ${i === 0 ? 'bg-accent text-white' : 'bg-primary text-white'}`}>
                         {order.customer.split(' ').map(n=>n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#18202D]">{order.customer}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{order.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-6 text-sm font-medium text-gray-500">{order.items} items</td>
                  <td className="px-4 py-6 font-bold text-[15px] text-[#18202D] tracking-tight">{order.total}</td>
                  <td className="px-4 py-6"><StatusBadge status={order.payment} /></td>
                  <td className="px-4 py-6"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-6 text-sm font-medium text-gray-400 whitespace-nowrap">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
