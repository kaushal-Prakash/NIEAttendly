"use client";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const t1 = gsap.timeline();
    t1.fromTo(".home-img",
      {opacity:0,y:30},
      {opacity:1,y:0,duration:1}
    ).fromTo(".home-content",
      {opacity:0,x:-10,y:30},
      {opacity:1,x:0,y:0,duration:1,delay:0.3,stagger:0.4}
    );
  });

  return (
    <div
      className="w-full grid place-content-center bg-cover bg-center h-screen"
      style={{ backgroundImage: "url('/home/bg.jpg')" }}
    >
      <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:gap-20 p-4">
        {/* Image Section */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 home-img">
          <Image
            src="/home/humans.png"
            alt="humans"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>

        {/* Text and Button Section */}
        <div className="text-center md:text-left backdrop-blur-sm border-b-2 border-r-2 rounded-md">
          <h1 className="text-3xl sm:text-4xl font-bold home-content text-slate-900 max-w-md mx-auto md:mx-0 p-2">
            Effortless Attendance Management in Real-Time
          </h1>
          <p className="text-lg max-w-lg text-slate-600 home-content mb-6 px-4 sm:px-0">
            Take control of your attendance system with ease. Manage attendance
            effortlessly, in real-time, wherever you are.
          </p>
          <div className="flex justify-center md:justify-start">
            <Link href="/signup">
              <button className="bg-blue-600 mb-5 home-content text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors">
                Let&apos;s Get Started!
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
