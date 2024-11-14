"use client";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import gsap from "gsap";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const t1 = gsap.timeline();
    t1.fromTo(
      ".navbar",
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1.5 }
    );
  }, []);

  return (
    <nav className="fixed navbar top-0 left-0 w-full flex items-center justify-between p-5 bg-blue-200 bg-transparent backdrop-blur-md text-black z-4\ shadow-inner border-b-2">
      <div className="text-xl font-bold text-blue-800">
        <Link href="/">Attendly</Link>
      </div>
      <div className="md:hidden z-50" onClick={toggleMenu}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>
      <ul
        className={`fixed top-0 left-0 w-full pr-5 h-screen bg-white md:bg-transparent backdrop-blur-3xl flex flex-col items-center justify-center space-y-8 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:relative md:flex-row md:space-y-0 md:space-x-6 md:transform-none md:h-auto md:w-auto font-semibold`}
      >
        <li className="text-2xl md:text-base hover:text-blue-800 duration-200 hover:scale-110 hover:-translate-x-1 hover:-translate-y-1">
          <Link href="/">Home</Link>
        </li>
        <li className="text-2xl md:text-base hover:text-blue-800 duration-200 hover:scale-110 hover:-translate-x-1 hover:-translate-y-1">
          <Link href="/about">About</Link>
        </li>
        <li className="text-2xl md:text-base hover:text-blue-800 duration-200 hover:scale-110 hover:-translate-x-1 hover:-translate-y-1">
          <Link href="/services">Services</Link>
        </li>
        <li className="text-2xl md:text-base hover:text-blue-800 duration-200 hover:scale-110 hover:-translate-x-1 hover:-translate-y-1">
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
