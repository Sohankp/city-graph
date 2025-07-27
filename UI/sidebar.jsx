import React from "react";

const Sidebar = () => {
  const moodMapImage = "https://lh3.googleusercontent.com/...";
  return (
    <aside className="flex flex-col w-[360px]">
      <h2 className="text-white text-[28px] font-bold px-4 pb-3 pt-5">Mood Map</h2>
      <div className="px-4 py-3">
        <div
          className="aspect-video bg-cover bg-center rounded-xl"
          style={{ backgroundImage: `url(${moodMapImage})` }}
        ></div>
      </div>
      <h2 className="text-white text-[22px] font-bold px-4 pb-3 pt-5">Alert/Advisory</h2>
      <p className="text-white text-base px-4 pb-3 pt-1">
        Stay informed about important updates and advisories related to the news articles displayed.
      </p>
      <h2 className="text-white text-[22px] font-bold px-4 pb-3 pt-5">Chatbot</h2>
      <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
        <label className="flex flex-col min-w-40 flex-1">
          <input
            placeholder="Ask me anything about Bangalore"
            className="form-input w-full rounded-xl text-white border border-[#474747] bg-[#212121] h-14 p-[15px] text-base placeholder:text-[#ababab]"
          />
        </label>
      </div>
      <div className="flex justify-end px-4 py-3">
        <button className="min-w-[84px] h-10 px-4 bg-black text-white text-sm font-bold rounded-full">
          Send
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
