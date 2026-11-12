import React from 'react';
import {
  Home,
  LayoutGrid,
  Clock,
  Heart,
  ReceiptText,
  Settings,
  UtensilsCrossed,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'menu', label: 'Menu', icon: Home },
  { id: 'catalog', label: 'All Food', icon: LayoutGrid },
  { id: 'tracking', label: 'Track Order', icon: Clock },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'history', label: 'Order History', icon: ReceiptText },
  { id: 'admin', label: 'Admin & Staff', icon: Settings },
];

export default function SidebarNav({ activeTab, onChangeTab, activeOrdersCount = 0, favoritesCount = 0 }) {
  return (
    <aside className="w-full lg:w-[76px] bg-white border-b lg:border-b-0 lg:border-r border-neutral-200/80 flex lg:flex-col items-center justify-between px-4 py-3 lg:py-6 shrink-0 z-20">
      {/* Brand Mark */}
      <button
        type="button"
        onClick={() => onChangeTab('menu')}
        title="Grill Restaurant"
        className="w-11 h-11 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center shadow-sm hover:bg-neutral-800 transition cursor-pointer shrink-0"
      >
        <UtensilsCrossed className="w-5 h-5" />
      </button>

      {/* Navigation Icons */}
      <nav className="flex lg:flex-col items-center gap-1.5 sm:gap-2 overflow-x-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              title={item.label}
              className={`group relative flex items-center justify-center w-11 h-11 rounded-xl transition cursor-pointer ${
                isActive
                  ? 'bg-[#1A1A1A] text-white shadow-md'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.id === 'tracking' && activeOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeOrdersCount}
                </span>
              )}
              {item.id === 'favorites' && favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Role Pill */}
      <div className="hidden lg:flex flex-col items-center gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
          SE331
        </span>
      </div>
    </aside>
  );
}
