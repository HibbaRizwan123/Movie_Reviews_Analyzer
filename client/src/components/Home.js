import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const typedRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
  const reviews = [
    {
      text: '"This film is an absolute masterpiece. Every scene is crafted with care."',
      label: 'Positive',
      badgeClass: 'bg-[#14532d] text-[#4ade80]',
    },
    {
      text: '"The movie was okay. Nothing special but not terrible either."',
      label: 'Neutral',
      badgeClass: 'bg-[#1e3a5f] text-[#93c5fd]',
    },
    {
      text: '"Completely boring and predictable. A waste of two hours."',
      label: 'Negative',
      badgeClass: 'bg-[#450a0a] text-[#f87171]',
    },
  ];

  let reviewIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeout;

  const el = typedRef.current;
  const badge = badgeRef.current;
  if (!el || !badge) return;

  function tick() {
    const current = reviews[reviewIndex];

    if (!isDeleting && charIndex <= current.text.length) {
      el.textContent = current.text.slice(0, charIndex);
      charIndex++;
      timeout = setTimeout(tick, 45);
    } else if (!isDeleting && charIndex > current.text.length) {
      badge.textContent = current.label;
      badge.className = `mt-3 inline-block text-xs font-condensed font-medium px-4 py-1 rounded-full transition-opacity duration-700 ${current.badgeClass}`;
      badge.style.opacity = '1';
      timeout = setTimeout(() => {
        badge.style.opacity = '0';
        isDeleting = true;
        timeout = setTimeout(tick, 400);
      }, 2000);
    } else if (isDeleting && charIndex > 0) {
      el.textContent = current.text.slice(0, charIndex);
      charIndex--;
      timeout = setTimeout(tick, 22);
    } else {
      isDeleting = false;
      reviewIndex = (reviewIndex + 1) % reviews.length;
      charIndex = 0;
      timeout = setTimeout(tick, 500);
    }
  }

  timeout = setTimeout(tick, 600);
  return () => clearTimeout(timeout);
}, []);

  return (
    <div className="min-h-screen text-white bg-custom-dark-blue flex flex-col">

      {/* Navbar */}
      <nav className="p-4 shadow-2xl border-b border-[#1e3a5f]">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            className="text-white text-3xl font-condensed font-bold hover:underline hover:underline-offset-4"
            style={{ textDecorationColor: '#a855f7', textDecorationThickness: '3px' }}
          >
            Movie Sentiment Analyzer
          </h1>
          <div className="space-x-5 mr-5">
            <Link
              to="/"
              className="text-white font-condensed text-lg hover:underline hover:underline-offset-4"
              style={{ textDecorationColor: '#a855f7', textDecorationThickness: '3px' }}
            >
              Home
            </Link>
            <a
              href="#about"
              className="text-[#cbd5e1] font-condensed text-lg hover:text-white hover:underline hover:underline-offset-4 transition-colors duration-200"
              style={{ textDecorationColor: '#a855f7', textDecorationThickness: '3px' }}
            >
              About
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center pt-24 px-6 flex-1">
        <h2
          className="font-condensed text-[#e2e8f0] font-bold text-5xl text-center hover:underline hover:underline-offset-4"
          style={{ textDecorationColor: '#a855f7', textDecorationThickness: '3px' }}
        >
          <span className="block">Welcome To</span>
          <span className="block mt-1">Movie Sentiment Analyzer</span>
        </h2>

        {/* Typing Animation */}
        <div className="mt-12 w-full max-w-xl">
          <div className="bg-[#111e32] rounded-lg p-5 border border-[#1e3a5f]">
            <p className="text-xs font-condensed text-[#a083c9] uppercase tracking-widest mb-3">
              Sample Review
            </p>
            <p
              className="font-condensed text-[#94a3b8] text-sm leading-relaxed min-h-[44px]"
              ref={typedRef}
            ></p>
            <span
              ref={badgeRef}
              className="mt-3 inline-block text-xs font-condensed font-medium px-4 py-1 rounded-full bg-[#14532d] text-[#4ade80] transition-opacity duration-700"
              style={{ opacity: 0 }}
            >
              Positive
            </span>
          </div>
        </div>

        {/* About + Buttons */}
        <div id="about" className="mt-16 max-w-2xl w-full">
          <h3
            className="font-condensed text-[#e2e8f0] text-lg font-semibold hover:underline hover:underline-offset-4"
            style={{ textDecorationColor: '#a855f7', textDecorationThickness: '3px' }}
          >
            About
          </h3>
          <p className="font-condensed text-[#94a3b8] mt-3 text-base font-normal leading-relaxed">
            Discover the emotional pulse of the online world with Movie Sentiment Analyzer, 
            your go-to tool for analyzing the sentiments behind movie reviews. Powered by 
            advanced sentiment analysis techniques, we help you understand whether reviews 
            are positive, negative, or neutral, giving you valuable insights into the 
            collective sentiment of your audience.
          </p>
          <div className="flex gap-4 mt-8">
            <Link to="/signup">
              <button className="font-condensed text-white px-6 py-2 font-normal bg-custom-blue rounded transition duration-300 ease-in-out hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#a855f7]">
                Sign Up
              </button>
            </Link>
            <Link to="/login">
              <button className="font-condensed text-white px-6 py-2 font-normal border border-[#a855f7] rounded transition duration-300 ease-in-out hover:scale-105 hover:bg-[#a855f7]/10 focus:outline-none focus:ring-2 focus:ring-[#a855f7]">
                Log In
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1e3a5f] p-4 text-center mt-16">
        <p className="text-[#4a6080] font-condensed text-sm">
          &copy; 2024 Sentiment Analyzer. All rights reserved.
        </p>
      </footer>

    </div>
  );
};