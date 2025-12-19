import { useState, useRef, useEffect } from "react";
import { Menu, Settings, Info, LogOut, User } from "lucide-react";

export default function HeaderWithMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">My Full Stack Project</h1>

      {/* Right Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <Menu size={22} />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 p-2 shadow-lg rounded-2xl">
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                <User size={16} /> Profile
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                <Settings size={16} /> Settings
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                <Info size={16} /> About Us
              </li>
              <hr />
              <li className="flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer">
                <LogOut size={16} /> Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
