import { Outlet } from 'react-router-dom';

import TopBar from './TopBar';

export default function PageLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <TopBar />
      <main className="flex-1 px-4 py-6 md:px-6">
        <Outlet />
      </main>
      <footer className="py-8 text-center text-xs text-gray-400">
        © Computer Shop
      </footer>
    </div>
  );
}
