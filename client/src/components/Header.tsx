



import { NavLink } from "react-router-dom";

const base = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
const inactive = "text-slate-600 hover:text-slate-900 hover:bg-slate-100";
const active = "text-slate-900 bg-slate-200";

export default function Header() {
  return (
        <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-3">
            <nav className="flex items-center justify-center gap-2">
                <NavLink  to="/"  end  className={({ isActive }) =>  `${base} ${isActive ? active : inactive}`}> Home</NavLink> 
                <NavLink  to="/send" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}> Send</NavLink>
                <NavLink to="/messages" className={({ isActive }) =>`${base} ${isActive ? active : inactive}`}> Messages </NavLink>
            </nav>
        </div>
        </header>
    );
}








