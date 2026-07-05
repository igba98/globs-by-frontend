function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl aspect-[3/4] relative overflow-hidden border border-gray-100 p-3 sm:p-4 animate-pulse">
      <div className="w-full h-6 bg-gray-100 rounded mb-6" />
      <div className="w-full h-[55%] bg-gray-100 rounded-lg" />
      <div className="w-2/3 h-3 bg-gray-100 rounded mt-4 mx-auto" />
      <div className="w-1/2 h-4 bg-gray-100 rounded mt-2 mx-auto" />
    </div>
  );
}

export default function ShopLoading() {
  return (
    <div className="w-full flex flex-col items-center space-y-12 pb-20 pt-4">
      <section className="w-full bg-[#f8f9fa] rounded-[2rem] py-16 px-6 sm:px-12 flex flex-col items-center border border-[#18202D]/5 max-w-[1600px] mx-auto animate-pulse">
        <div className="h-9 w-80 max-w-full bg-gray-200 rounded mb-4" />
        <div className="h-4 w-64 bg-gray-200 rounded mb-8" />
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-gray-200 rounded-full" />
          ))}
        </div>
      </section>

      <section className="w-full flex flex-col gap-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 px-4 w-full max-w-[1600px] mx-auto">
          {Array.from({ length: 12 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
