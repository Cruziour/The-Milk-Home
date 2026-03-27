import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../app/features/themeSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const mode = useSelector(state => state.theme.mode);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-blue-500 dark:bg-gray-800 text-white shadow-md">
      <h1 className="text-lg font-semibold">Milk Admin</h1>

      <ul className="flex gap-6 text-sm">
        <li className="cursor-pointer hover:underline">Home</li>
        <li className="cursor-pointer hover:underline">Manage Milk</li>
        <li className="cursor-pointer hover:underline">Reports</li>
        <li className="cursor-pointer hover:underline">Config</li>
      </ul>

      <button
        onClick={() => dispatch(toggleTheme())}
        className="bg-white text-black dark:bg-gray-700 dark:text-white px-3 py-1 rounded-md text-sm"
      >
        {mode === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </nav>
  );
};

export default Navbar;
