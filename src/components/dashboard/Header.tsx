import {
  Bell,
  Search,
  Plus,
  X,
  CheckCircle2,
  Clock,
  LogOut,
  User,
  Settings,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  useTasks,
} from "../../context/TaskContext";

import {
  getCurrentUser,
} from "../../services/api";

/* =========================
   TYPES
========================= */

type HeaderProps = {
  onNewTask: () => void;
};

type CurrentUser = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  profileImage?: string;
};

/* =========================
   HEADER
========================= */

function Header({
  onNewTask,
}: HeaderProps) {
  const navigate =
    useNavigate();

  const {
    tasks,
  } = useTasks();

  /* =========================
     USER
  ========================= */

  const [userName, setUserName] =
    useState("");

  const [userEmail, setUserEmail] =
    useState("");

  const [profileImage, setProfileImage] =
    useState("");

  /* =========================
     DROPDOWNS
  ========================= */

  const [
    isSearchOpen,
    setIsSearchOpen,
  ] = useState(false);

  const [
    isNotificationsOpen,
    setIsNotificationsOpen,
  ] = useState(false);

  const [
    isProfileOpen,
    setIsProfileOpen,
  ] = useState(false);

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  /* =========================
     REFS
  ========================= */

  const searchRef =
    useRef<HTMLDivElement>(
      null
    );

  const notificationRef =
    useRef<HTMLDivElement>(
      null
    );

  const profileRef =
    useRef<HTMLDivElement>(
      null
    );

  /* =========================
     LOAD USER
  ========================= */

  useEffect(() => {
    loadUser();

    function handleProfileChanged() {
      loadUser();
    }

    window.addEventListener(
      "profile-updated",
      handleProfileChanged
    );

    return () => {
      window.removeEventListener(
        "profile-updated",
        handleProfileChanged
      );
    };
  }, []);

  /* =========================
     GET CURRENT USER
  ========================= */

  async function loadUser() {
    try {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        setUserName("");
        setUserEmail("");
        setProfileImage("");

        return;
      }

      const user =
        await getCurrentUser();

      const currentUser =
        user as CurrentUser;

      setUserName(
        currentUser.name || ""
      );

      setUserEmail(
        currentUser.email || ""
      );

      setProfileImage(
        currentUser.profileImage ||
          ""
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          currentUser
        )
      );
    } catch (error) {
      console.error(
        "Failed to load current user:",
        error
      );

      const storedUser =
        localStorage.getItem(
          "user"
        );

      if (!storedUser) {
        return;
      }

      try {
        const user =
          JSON.parse(
            storedUser
          ) as CurrentUser;

        setUserName(
          user.name || ""
        );

        setUserEmail(
          user.email || ""
        );

        setProfileImage(
          user.profileImage ||
            ""
        );
      } catch {
        console.error(
          "Invalid stored user data."
        );
      }
    }
  }

  /* =========================
     SEARCH RESULTS
  ========================= */

  const filteredTasks =
    searchQuery.trim() === ""
      ? []
      : tasks.filter(
          (task) => {
            const query =
              searchQuery
                .toLowerCase()
                .trim();

            return (
              task.title
                .toLowerCase()
                .includes(query) ||
              task.description
                .toLowerCase()
                .includes(query) ||
              task.category
                .toLowerCase()
                .includes(query)
            );
          }
        );

  /* =========================
     NOTIFICATIONS
  ========================= */

  const incompleteTasks =
    tasks.filter(
      (task) =>
        !task.completed
    );

  /* =========================
     CLOSE DROPDOWNS
  ========================= */

  useEffect(() => {
    function handleOutsideClick(
      event: MouseEvent
    ) {
      const target =
        event.target as Node;

      if (
        searchRef.current &&
        !searchRef.current.contains(
          target
        )
      ) {
        setIsSearchOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          target
        )
      ) {
        setIsNotificationsOpen(
          false
        );
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(
          target
        )
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =========================
     SEARCH
  ========================= */

  function handleSearchClick() {
    setIsSearchOpen(
      (current) =>
        !current
    );

    setIsNotificationsOpen(
      false
    );

    setIsProfileOpen(false);
  }

  function handleSearchTaskClick() {
    setIsSearchOpen(false);
    setSearchQuery("");

    navigate("/tasks");
  }

  /* =========================
     NOTIFICATIONS
  ========================= */

  function handleNotificationClick() {
    setIsNotificationsOpen(
      (current) =>
        !current
    );

    setIsSearchOpen(false);
    setIsProfileOpen(false);
  }

  function handleViewTasks() {
    setIsNotificationsOpen(
      false
    );

    navigate("/tasks");
  }

  /* =========================
     PROFILE
  ========================= */

  function handleProfileClick() {
    setIsProfileOpen(
      (current) =>
        !current
    );

    setIsSearchOpen(false);

    setIsNotificationsOpen(
      false
    );
  }

  /* =========================
     LOGOUT
  ========================= */

  function handleLogout() {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "userId"
    );

    window.dispatchEvent(
      new Event(
        "auth-changed"
      )
    );

    setIsProfileOpen(false);

    navigate("/login", {
      replace: true,
    });
  }

  /* =========================
     AVATAR
  ========================= */

  const initials =
    getInitials(
      userName
    );

  /* =========================
     RENDER
  ========================= */

  return (
    <header className="relative flex h-20 items-center justify-between border-b border-zinc-200 bg-white px-6 transition-colors dark:border-zinc-800 dark:bg-zinc-900 lg:px-10">

      {/* =========================
          LEFT
      ========================= */}

      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Here's what's happening today.
        </p>
      </div>

      {/* =========================
          RIGHT
      ========================= */}

      <div className="flex items-center gap-3">

        {/* =========================
            SEARCH
        ========================= */}

        <div
          ref={searchRef}
          className="relative"
        >
          <button
            type="button"
            onClick={
              handleSearchClick
            }
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white sm:flex"
            aria-label="Search"
          >
            {isSearchOpen ? (
              <X size={20} />
            ) : (
              <Search
                size={20}
              />
            )}
          </button>

          {isSearchOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">

              <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 dark:border-zinc-700">

                <Search
                  size={18}
                  className="shrink-0 text-zinc-400"
                />

                <input
                  autoFocus
                  type="text"
                  value={
                    searchQuery
                  }
                  onChange={(
                    event
                  ) =>
                    setSearchQuery(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search tasks..."
                  className="h-11 min-w-0 flex-1 bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery(
                        ""
                      )
                    }
                    className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  >
                    <X
                      size={16}
                    />
                  </button>
                )}

              </div>

              {/* Results */}

              {searchQuery.trim() !==
                "" && (
                <div className="mt-3 max-h-72 overflow-y-auto">

                  {filteredTasks.length ===
                  0 ? (
                    <div className="px-3 py-6 text-center">

                      <Search
                        size={24}
                        className="mx-auto text-zinc-300 dark:text-zinc-600"
                      />

                      <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">
                        No tasks found
                      </p>

                      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                        Try another search
                      </p>

                    </div>
                  ) : (
                    <div className="space-y-1">

                      {filteredTasks.map(
                        (task) => (
                          <button
                            key={
                              task._id
                            }
                            type="button"
                            onClick={
                              handleSearchTaskClick
                            }
                            className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-violet-50 dark:hover:bg-zinc-800"
                          >

                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">

                              {task.completed ? (
                                <CheckCircle2
                                  size={
                                    16
                                  }
                                />
                              ) : (
                                <Clock
                                  size={
                                    16
                                  }
                                />
                              )}

                            </div>

                            <div className="min-w-0">

                              <p
                                className={`truncate text-sm font-semibold ${
                                  task.completed
                                    ? "text-zinc-400 line-through"
                                    : "text-zinc-800 dark:text-zinc-100"
                                }`}
                              >
                                {
                                  task.title
                                }
                              </p>

                              <p className="mt-1 truncate text-xs text-zinc-400 dark:text-zinc-500">
                                {
                                  task.category
                                }
                              </p>

                            </div>

                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>
              )}

              {searchQuery.trim() ===
                "" && (
                <p className="px-2 py-3 text-xs text-zinc-400 dark:text-zinc-500">
                  Search by task title, description, or category.
                </p>
              )}

            </div>
          )}

        </div>

        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <div
          ref={
            notificationRef
          }
          className="relative"
        >

          <button
            type="button"
            onClick={
              handleNotificationClick
            }
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
            aria-label="Notifications"
          >

            <Bell size={20} />

            {incompleteTasks.length >
              0 && (
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-600" />
            )}

          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">

              <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-4 dark:border-zinc-800">

                <div>

                  <h3 className="font-bold text-zinc-900 dark:text-white">
                    Notifications
                  </h3>

                  <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    Your latest task activity
                  </p>

                </div>

                <div className="flex h-7 min-w-7 items-center justify-center rounded-full bg-violet-100 px-2 text-xs font-bold text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                  {
                    incompleteTasks.length
                  }
                </div>

              </div>

              <div className="max-h-72 overflow-y-auto p-2">

                {incompleteTasks.length ===
                0 ? (
                  <div className="px-4 py-8 text-center">

                    <CheckCircle2
                      size={28}
                      className="mx-auto text-green-500"
                    />

                    <p className="mt-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                      You're all caught up!
                    </p>

                    <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                      No unfinished tasks.
                    </p>

                  </div>
                ) : (
                  incompleteTasks
                    .slice(0, 5)
                    .map(
                      (task) => (
                        <button
                          key={
                            task._id
                          }
                          type="button"
                          onClick={
                            handleViewTasks
                          }
                          className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        >

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <Clock
                              size={17}
                            />
                          </div>

                          <div className="min-w-0">

                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                              Task still in progress
                            </p>

                            <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
                              {
                                task.title
                              }
                            </p>

                          </div>

                        </button>
                      )
                    )
                )}

              </div>

              {incompleteTasks.length >
                5 && (
                <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">

                  <button
                    type="button"
                    onClick={
                      handleViewTasks
                    }
                    className="w-full text-center text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                  >
                    View all tasks
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

        {/* =========================
            NEW TASK
        ========================= */}

        <button
          type="button"
          onClick={
            onNewTask
          }
          className="flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.98]"
        >

          <Plus size={18} />

          <span className="hidden sm:inline">
            New Task
          </span>

        </button>

        {/* =========================
            PROFILE
        ========================= */}

        <div
          ref={profileRef}
          className="relative ml-1"
        >

          <button
            type="button"
            onClick={
              handleProfileClick
            }
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-sm font-bold text-white shadow-sm transition hover:scale-105"
            aria-label="User profile"
          >

            {profileImage ? (
              <img
                src={
                  profileImage
                }
                alt={
                  userName
                    ? `${userName} profile`
                    : "User profile"
                }
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}

          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">

              {/* USER INFO */}

              <div className="mb-1 rounded-xl bg-zinc-50 p-3 dark:bg-zinc-800">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-sm font-bold text-white">

                    {profileImage ? (
                      <img
                        src={
                          profileImage
                        }
                        alt={
                          userName
                            ? `${userName} profile`
                            : "User profile"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}

                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                      {userName ||
                        "User"}
                    </p>

                    {userEmail && (
                      <p className="truncate text-xs text-zinc-400 dark:text-zinc-500">
                        {
                          userEmail
                        }
                      </p>
                    )}

                  </div>

                </div>

              </div>

              {/* PROFILE */}

              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(
                    false
                  );

                  navigate(
                    "/profile"
                  );
                }}
                className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-zinc-600 transition hover:bg-violet-50 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-violet-400"
              >
                <User
                  size={18}
                />

                Profile
              </button>

              {/* SETTINGS */}

              <button
                type="button"
                onClick={() => {
                  setIsProfileOpen(
                    false
                  );

                  navigate(
                    "/settings"
                  );
                }}
                className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-zinc-600 transition hover:bg-violet-50 hover:text-violet-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-violet-400"
              >
                <Settings
                  size={18}
                />

                Settings
              </button>

              <div className="my-1 h-px bg-zinc-100 dark:bg-zinc-800" />

              {/* LOGOUT */}

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-red-500 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >

                <LogOut
                  size={18}
                />

                Log out

              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
}

/* =========================
   INITIALS
========================= */

function getInitials(
  name: string
) {
  const trimmed =
    name.trim();

  if (!trimmed) {
    return "HK";
  }

  const parts =
    trimmed.split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[
      parts.length - 1
    ][0]
  ).toUpperCase();
}

export default Header;