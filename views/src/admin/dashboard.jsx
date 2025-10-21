import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../admin/partials/hearder";
import Sidebar from "../admin/partials/Sidebar";
import Footer from "../admin/partials/footer";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 bg-purple-50 overflow-y-auto mt-16  px-4  md:px-6 lg:pl-72 lg:pr-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
