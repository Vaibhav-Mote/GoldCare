export default function DashboardCard({ title, value, icon: Icon, color, subtitle, trend }) {
  const colorMap = {
    gold: { bg: 'from-amber-500 to-yellow-400', text: 'text-amber-800', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-800' },
    brown: { bg: 'from-stone-700 to-stone-600', text: 'text-stone-800', border: 'border-stone-200', badge: 'bg-stone-100 text-stone-800' },
    green: { bg: 'from-emerald-500 to-green-400', text: 'text-emerald-800', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-800' },
    blue: { bg: 'from-blue-500 to-sky-400', text: 'text-blue-800', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-800' },
    orange: { bg: 'from-orange-500 to-amber-400', text: 'text-orange-800', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-800' },
    red: { bg: 'from-red-500 to-rose-400', text: 'text-red-800', border: 'border-red-200', badge: 'bg-red-100 text-red-800' },
    purple: { bg: 'from-purple-500 to-violet-400', text: 'text-purple-800', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-800' },
  };

  const c = colorMap[color] || colorMap.gold;

  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 border ${c.border} shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}>
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-sm shrink-0`}>
          {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />}
        </div>
        {trend !== undefined && (
          <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">{value}</p>
        <p className={`text-xs sm:text-sm font-semibold ${c.text} mt-0.5 truncate`}>{title}</p>
        {subtitle && <p className="text-[11px] text-stone-500 mt-0.5 truncate">{subtitle}</p>}
      </div>
    </div>
  );
}
