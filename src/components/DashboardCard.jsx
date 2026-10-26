export default function DashboardCard({ title, value, icon: Icon, color, subtitle, trend }) {
  const colorMap = {
    gold: { bg: 'from-amber-500 to-yellow-400', text: 'text-amber-700', light: 'bg-amber-50', border: 'border-amber-200' },
    brown: { bg: 'from-stone-700 to-stone-600', text: 'text-stone-700', light: 'bg-stone-50', border: 'border-stone-200' },
    green: { bg: 'from-emerald-500 to-green-400', text: 'text-emerald-700', light: 'bg-emerald-50', border: 'border-emerald-200' },
    blue: { bg: 'from-blue-500 to-sky-400', text: 'text-blue-700', light: 'bg-blue-50', border: 'border-blue-200' },
    orange: { bg: 'from-orange-500 to-amber-400', text: 'text-orange-700', light: 'bg-orange-50', border: 'border-orange-200' },
    red: { bg: 'from-red-500 to-rose-400', text: 'text-red-700', light: 'bg-red-50', border: 'border-red-200' },
    purple: { bg: 'from-purple-500 to-violet-400', text: 'text-purple-700', light: 'bg-purple-50', border: 'border-purple-200' },
  };

  const c = colorMap[color] || colorMap.gold;

  return (
    <div className={`bg-white rounded-2xl p-5 border ${c.border} shadow-sm card-hover`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-md`}>
          {Icon && <Icon className="w-6 h-6 text-white" />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
          }`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-stone-800">{value}</p>
        <p className={`text-sm font-semibold ${c.text} mt-0.5`}>{title}</p>
        {subtitle && <p className="text-xs text-stone-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
