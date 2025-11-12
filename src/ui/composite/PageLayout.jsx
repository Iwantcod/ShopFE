import { Outlet } from 'react-router-dom';

import TopBar from './TopBar';

export default function PageLayout() {
  return (
    <div className="relative flex min-h-screen w-full flex-col text-[#2b231c]">
      <TopBar />
      <main className="flex-1 px-4 py-8 md:px-6 lg:px-10">
        <div className="mx-auto w-full max-w-6xl rounded-3xl border border-[rgba(223,200,173,0.4)] bg-white/80 p-6 backdrop-blur md:p-10">
          <Outlet />
        </div>
      </main>
      <footer className="py-10 text-center text-xs text-[#806c5d]">
        © Computer Shop
      </footer>
    </div>
  );
}
