'use client';
export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[#0a0a0a] text-white py-2 overflow-hidden whitespace-nowrap">
      <div className="flex justify-center space-x-12 text-sm md:text-base font-normal tracking-wide opacity-90">
        <span>Globsby Stationary - For Top Quality Supplies</span>
        <span className="font-medium text-white/50">|</span>
        <span>Dar es Salaam office - Grants Care Building (0743 483 769)</span>
        <span className="font-medium text-white/50">|</span>
        <span>Mbeya office - Mwanjelwa Tunduma Road (0769 017 608)</span>
        <span className="font-medium text-white/50">|</span>
        <span>Order from us and pay in this website!</span>
      </div>
    </div>
  );
}
