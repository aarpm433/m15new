import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/SideNav";
import { useState, useEffect } from "react";

const App = () => {
  const [isNarrow, setIsNarrow] = useState(window.innerWidth < 1366);

  useEffect(() => {
    const handleResize = () => setIsNarrow(window.innerWidth < 1366);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex flex-column vh-100">
      {/* Top Navbar */}
      <Navbar />

      {/* Horizontal sidebar for narrow screens */}
      {isNarrow && (
        <div className="bg-light border-bottom d-flex justify-content-around py-2">
          <Sidebar horizontal />
        </div>
      )}

      <div className="d-flex flex-grow-1 overflow-hidden">
        {/* Vertical sidebar for wide screens */}
        {!isNarrow && (
          <aside className="bg-light border-end" style={{ width: "16rem" }}>
            <Sidebar />
          </aside>
        )}

        {/* Main content */}
        <main className="flex-grow-1 p-4 overflow-auto bg-light">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;
