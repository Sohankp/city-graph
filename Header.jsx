import React from "react";

const Header = () => (
  <header className="flex items-center justify-between border-b border-[#303030] px-10 py-3">
    <div className="flex items-center gap-4 text-white">
      <div className="w-4 h-4">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
        </svg>
      </div>
      <h2 className="text-lg font-bold tracking-tight">Bangalore Buzz</h2>
    </div>
    <div className="flex flex-1 justify-end gap-8">
      <div className="flex items-center gap-9">
        <a className="text-white text-sm font-medium" href="#">Top Stories</a>
        <a className="text-white text-sm font-medium" href="#">Filter by Category</a>
        <a className="text-white text-sm font-medium" href="#">Add Event</a>
      </div>
      <button className="flex items-center justify-center h-10 px-2.5 bg-[#303030] rounded-full text-white text-sm font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
          <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94..." />
        </svg>
      </button>
      <div
        className="w-10 h-10 rounded-full bg-cover bg-center"
        style={{
          backgroundImage: "url('https://lh3.googleusercontent.com/...')"
        }}
      />
    </div>
  </header>
);

export default Header;
