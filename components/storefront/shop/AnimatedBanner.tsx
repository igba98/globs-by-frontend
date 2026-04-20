'use client';

import React, { useState, useEffect } from 'react';

const bannerContent = [
  { text: "Up to 30% Off on Selected Stationary", color: "bg-[#18202D]", textColor: "text-white" },
  { text: "Free Delivery in Dar es Salaam on Orders over TZS 50,000", color: "bg-[#94B447]", textColor: "text-white" },
  { text: "New Arrival: Premium Mesh Office Document Trays", color: "bg-[#F5A623]", textColor: "text-[#18202D]" },
];

export default function AnimatedBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerContent.length);
    }, 4000); // 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`w-full h-24 md:h-32 flex items-center justify-center transition-colors duration-1000 overflow-hidden relative ${bannerContent[currentIndex].color}`}>
      {bannerContent.map((content, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 transform-none' : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 className={`text-xl md:text-3xl font-bold tracking-tight text-center px-4 ${content.textColor} mix-blend-plus-lighter`}>
            {content.text}
          </h3>
        </div>
      ))}
    </div>
  );
}
