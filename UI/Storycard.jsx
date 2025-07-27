import React from "react";

const StoryCard = ({ title, description, image }) => (
  <div className="p-4">
    <div className="flex items-stretch gap-4 rounded-xl">
      <div className="flex flex-col gap-1 flex-[2_2_0px]">
        <p className="text-white text-base font-bold leading-tight">{title}</p>
        <p className="text-[#ababab] text-sm">{description}</p>
      </div>
      <div
        className="aspect-video bg-cover bg-center rounded-xl flex-1"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
    </div>
  </div>
);

export default StoryCard;
