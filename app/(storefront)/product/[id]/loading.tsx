export default function ProductLoading() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 lg:py-16 animate-pulse">
      <div className="mb-8 h-4 w-24 bg-gray-100 rounded" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery skeleton */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-[2rem]" />
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-[2rem]" />
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-[2rem]" />
          </div>
        </div>

        {/* Detail skeleton */}
        <div className="flex flex-col justify-start py-8 gap-4">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-10 w-2/3 bg-gray-100 rounded" />
          <div className="h-4 w-full bg-gray-100 rounded" />
          <div className="h-4 w-5/6 bg-gray-100 rounded" />
          <div className="h-8 w-40 bg-gray-100 rounded mt-4" />
          <div className="flex gap-4 mt-8">
            <div className="w-20 h-[52px] bg-gray-100 rounded" />
            <div className="w-40 h-[52px] bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
