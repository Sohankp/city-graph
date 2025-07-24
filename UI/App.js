import React from "react";
import Header from "./components/Header";
import StoryCard from "./components/Storycard";
import Sidebar from "./components/sidebar";

const App = () => {
  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#141414] overflow-x-hidden"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="flex h-full grow flex-col">
        <Header />
        <main className="flex justify-center gap-1 py-5 px-6 flex-1">
          <section className="flex flex-col max-w-[920px] flex-1">
            <h2 className="text-white text-[28px] font-bold px-4 pb-3 pt-5">Top Stories of Bangalore</h2>
            {topStories.map((story, idx) => (
              <StoryCard key={idx} {...story} />
            ))}
          </section>
          <Sidebar />
        </main>
      </div>
    </div>
  );
};

const topStories = [
  {
    title: "Tech Sector Boom Fuels Bangalore's Growth",
    description:
      "The city's tech industry continues to attract global talent and investment, driving economic expansion and innovation.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCw_IvvIE8OMaF9geQx864OjKJefJnhDNuaUWq8rO0lqrWIzQt6nUs2lazW1VPEVdk7p7MR1faWfFM9B9lYekeHQ_R1TX6Cikk9hqOS8caqgtrGzjVDXdhN8MKYOxYxByvYPs7SE6vuSpHS2g_-xnbCwIEKvgK_gZT-MG1dGKp-5wOLjite_VQlU9imvbJV9Ga8Bv2KSEPu4fMwQKDBtBLtXOS9TzSL-bk8Rp3zGhqiDoKldxJlMNg15MIZCGWj1VcGo5NO3Ls-0W0",
  },
  // Add other story objects here...
];

export default App;
