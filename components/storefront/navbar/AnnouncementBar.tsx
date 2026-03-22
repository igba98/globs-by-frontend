'use client';
export default function AnnouncementBar() {
  return (
    <div className="w-full bg-[#0a0a0a] text-white py-2 overflow-hidden whitespace-nowrap">
      <div className="flex justify-center space-x-4 md:space-x-8 text-xs md:text-sm font-light tracking-wide opacity-90">
        <span className="hidden md:inline">Transform Your Workspace – Save 30% Today!</span>
        <span className="font-medium text-white/50">|</span>
        <span>Transform Your Workspace – Save 30% Today!</span>
        <span className="font-medium text-white/50">|</span>
        <span className="hidden md:inline">Transform Your Workspace – Save 30% Today!</span>
      </div>
    </div>
  );
}
