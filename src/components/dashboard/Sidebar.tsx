import {
  Brain,
  LayoutDashboard,
  ListTodo,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
  Link,
} from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "My Tasks",
      icon: ListTodo,
      path: "/tasks",
    },
    {
      name: "Calendar",
      icon: CalendarDays,
      path: "/calendar",
    },
    {
      name: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
    {
      name: "Brain Dump",
      icon: Brain,
      path: "/brain-dump",
    },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <aside className="hidden min-h-screen w-64 shrink-0 flex-col border-r border-zinc-200 bg-white transition-colors dark:border-zinc-800 dark:bg-zinc-900 lg:flex">

      {/* =====================================================
          LOGO
      ===================================================== */}

      <Link
        to="/brain-dump"
        className="flex h-20 items-center gap-3 border-b border-zinc-200 px-7 transition-colors dark:border-zinc-800"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm transition hover:bg-violet-700">
          <Brain size={22} />
        </div>

        <span className="text-lg font-bold text-zinc-900 dark:text-white">
          BrainDump AI
        </span>
      </Link>

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav className="flex-1 space-y-2 p-4">

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium transition ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-violet-950/40"
                    : "text-zinc-500 hover:bg-violet-50 hover:text-violet-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-violet-400"
                }`
              }
            >
              <Icon size={20} />

              <span>
                {item.name}
              </span>
            </NavLink>
          );
        })}

      </nav>

      {/* =====================================================
          BOTTOM ACTIONS
      ===================================================== */}

      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">

        {/* Settings */}

        <button
          type="button"
          onClick={() =>
            navigate("/settings")
          }
          className="flex h-12 w-full items-center gap-3 rounded-xl px-4 text-sm font-medium text-zinc-500 transition hover:bg-violet-50 hover:text-violet-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-violet-400"
        >
          <Settings size={20} />

          <span>
            Settings
          </span>
        </button>

        {/* Logout */}

        <button
          type="button"
          onClick={handleLogout}
          className="mt-1 flex h-12 w-full items-center gap-3 rounded-xl px-4 text-sm font-medium text-zinc-500 transition hover:bg-red-50 hover:text-red-500 dark:text-zinc-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        >
          <LogOut size={20} />

          <span>
            Log out
          </span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;