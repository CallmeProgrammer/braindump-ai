import {
  ArrowLeft,
  Bell,
  Brain,
  Camera,
  Check,
  Lock,
  LogOut,
  Moon,
  Palette,
  Save,
  Shield,
  Sun,
  Trash2,
  User,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  ChangeEvent,
  FormEvent,
  ReactNode,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";

import {
  getCurrentUser,
  updateProfile,
  updatePassword,
  deleteAccount,
} from "../services/api";

/* =========================================================
   TYPES
========================================================= */

type Theme = "light" | "dark" | "system";

type Section =
  | "profile"
  | "appearance"
  | "notifications"
  | "ai"
  | "security"
  | "danger";

/* =========================================================
   THEME HELPER
========================================================= */

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    return;
  }

  if (theme === "light") {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    return;
  }

  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  root.classList.toggle(
    "dark",
    prefersDark
  );

  root.setAttribute(
    "data-theme",
    prefersDark ? "dark" : "light"
  );
}

/* =========================================================
   SETTINGS PAGE
========================================================= */

function SettingsPage() {
  const navigate = useNavigate();

  /* =========================
     USER
  ========================= */

  const [userName, setUserName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [profileImage, setProfileImage] =
    useState("");

  const [nameInput, setNameInput] =
    useState("");

  /* =========================
     PASSWORD
  ========================= */

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  /* =========================
     UI
  ========================= */

  const [activeSection, setActiveSection] =
    useState<Section>("profile");

  const [theme, setTheme] =
    useState<Theme>("light");

  const [saveMessage, setSaveMessage] =
    useState("");

  const [saveError, setSaveError] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [isLoadingProfile, setIsLoadingProfile] =
    useState(true);

  const [isSavingProfile, setIsSavingProfile] =
    useState(false);

  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  const [isDeletingAccount, setIsDeletingAccount] =
    useState(false);

  /* =========================
     NOTIFICATIONS
  ========================= */

  const [taskNotifications, setTaskNotifications] =
    useState(true);

  const [aiNotifications, setAiNotifications] =
    useState(true);

  const [dailySummary, setDailySummary] =
    useState(false);

  /* =========================
     AI
  ========================= */

  const [aiSuggestions, setAiSuggestions] =
    useState(true);

  const [smartPriorities, setSmartPriorities] =
    useState(true);

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadUser();

    const storedTheme =
      localStorage.getItem("theme") as Theme | null;

    const initialTheme: Theme =
      storedTheme === "dark" ||
      storedTheme === "system" ||
      storedTheme === "light"
        ? storedTheme
        : "light";

    setTheme(initialTheme);
    applyTheme(initialTheme);

    /* =========================
       SAVED SETTINGS
    ========================= */

    const savedTaskNotifications =
      localStorage.getItem(
        "taskNotifications"
      );

    const savedAiNotifications =
      localStorage.getItem(
        "aiNotifications"
      );

    const savedDailySummary =
      localStorage.getItem(
        "dailySummary"
      );

    const savedAiSuggestions =
      localStorage.getItem(
        "aiSuggestions"
      );

    const savedSmartPriorities =
      localStorage.getItem(
        "smartPriorities"
      );

    if (
      savedTaskNotifications !== null
    ) {
      setTaskNotifications(
        savedTaskNotifications === "true"
      );
    }

    if (
      savedAiNotifications !== null
    ) {
      setAiNotifications(
        savedAiNotifications === "true"
      );
    }

    if (
      savedDailySummary !== null
    ) {
      setDailySummary(
        savedDailySummary === "true"
      );
    }

    if (
      savedAiSuggestions !== null
    ) {
      setAiSuggestions(
        savedAiSuggestions === "true"
      );
    }

    if (
      savedSmartPriorities !== null
    ) {
      setSmartPriorities(
        savedSmartPriorities === "true"
      );
    }
  }, []);

  /* =========================================================
     SYSTEM THEME LISTENER
  ========================================================= */

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    const handleChange = () => {
      applyTheme("system");
    };

    mediaQuery.addEventListener(
      "change",
      handleChange
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleChange
      );
    };
  }, [theme]);

  /* =========================================================
     LOAD USER
  ========================================================= */

  async function loadUser() {
    try {
      setIsLoadingProfile(true);

      const user =
        await getCurrentUser();

      setUserName(
        user.name || ""
      );

      setNameInput(
        user.name || ""
      );

      setEmail(
        user.email || ""
      );

      setProfileImage(
        user.profileImage || ""
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );
    } catch (error) {
      console.error(
        "Failed to load user:",
        error
      );

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to load profile."
      );
    } finally {
      setIsLoadingProfile(false);
    }
  }

  /* =========================================================
     PROFILE IMAGE
  ========================================================= */

  function handleProfileImage(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      setSaveError(
        "Please select a valid image file."
      );

      return;
    }

    const maxSize =
      2 * 1024 * 1024;

    if (file.size > maxSize) {
      setSaveError(
        "Image must be smaller than 2 MB."
      );

      return;
    }

    setSaveError("");
    setSaveMessage("");

    const reader =
      new FileReader();

    reader.onload = () => {
      if (
        typeof reader.result !== "string"
      ) {
        setSaveError(
          "Failed to process image."
        );

        return;
      }

      setProfileImage(
        reader.result
      );
    };

    reader.onerror = () => {
      setSaveError(
        "Failed to read image."
      );
    };

    reader.readAsDataURL(file);
  }

  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  async function handleSaveProfile() {
    const trimmedName =
      nameInput.trim();

    if (!trimmedName) {
      setSaveError(
        "Name cannot be empty."
      );

      setSaveMessage("");

      return;
    }

    try {
      setIsSavingProfile(true);

      setSaveMessage("");
      setSaveError("");

      const updatedUser =
        await updateProfile({
          name: trimmedName,
          profileImage,
        });

      setUserName(
        updatedUser.name
      );

      setNameInput(
        updatedUser.name
      );

      setEmail(
        updatedUser.email
      );

      setProfileImage(
        updatedUser.profileImage || ""
      );

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setSaveMessage(
        "Profile updated successfully."
      );

      window.setTimeout(() => {
        setSaveMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  /* =========================================================
     PASSWORD
  ========================================================= */

  async function handlePasswordChange(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please fill in all password fields."
      );

      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setPasswordError(
        "New passwords do not match."
      );

      return;
    }

    try {
      setIsChangingPassword(true);

      await updatePassword(
        currentPassword,
        newPassword
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage(
        "Password updated successfully."
      );

      window.setTimeout(() => {
        setPasswordMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to update password:",
        error
      );

      setPasswordError(
        error instanceof Error
          ? error.message
          : "Failed to update password."
      );
    } finally {
      setIsChangingPassword(false);
    }
  }

  /* =========================================================
     THEME
  ========================================================= */

  function handleThemeChange(
    value: Theme
  ) {
    setTheme(value);

    localStorage.setItem(
      "theme",
      value
    );

    applyTheme(value);
  }

  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  function updateNotification(
    key: string,
    value: boolean
  ) {
    localStorage.setItem(
      key,
      String(value)
    );
  }

  /* =========================================================
     LOGOUT
  ========================================================= */

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

    navigate("/login", {
      replace: true,
    });
  }

  /* =========================================================
     DELETE ACCOUNT
  ========================================================= */

  async function handleDeleteAccount() {
    try {
      setIsDeletingAccount(true);

      await deleteAccount();

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "userId"
      );

      localStorage.removeItem(
        "profileImage"
      );

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Failed to delete account:",
        error
      );

      setSaveError(
        error instanceof Error
          ? error.message
          : "Failed to delete account."
      );

      setShowDeleteModal(false);
    } finally {
      setIsDeletingAccount(false);
    }
  }

  /* =========================================================
     SETTINGS SECTIONS
  ========================================================= */

  const sections: {
    id: Section;
    label: string;
    icon: typeof User;
  }[] = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: Palette,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "ai",
      label: "AI Preferences",
      icon: Brain,
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
    },
    {
      id: "danger",
      label: "Danger Zone",
      icon: Trash2,
    },
  ];

  /* =========================================================
     LOADING
  ========================================================= */

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-screen bg-[#f6f6fb] dark:bg-zinc-950">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <SettingsHeader
            navigate={navigate}
          />

          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />

              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                Loading your profile...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <div className="flex min-h-screen bg-[#f6f6fb] transition-colors dark:bg-zinc-950">

      <Sidebar />

      <main className="min-w-0 flex-1">

        <SettingsHeader
          navigate={navigate}
        />

        <div className="mx-auto max-w-6xl p-6 lg:p-10">

          <div className="grid gap-8 lg:grid-cols-[220px_1fr]">

            {/* =================================================
                SETTINGS NAVIGATION
            ================================================= */}

            <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

              {sections.map(
                (section) => {
                  const Icon =
                    section.icon;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() =>
                        setActiveSection(
                          section.id
                        )
                      }
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                        activeSection ===
                        section.id
                          ? "bg-violet-600 text-white"
                          : "text-zinc-500 hover:bg-violet-50 hover:text-violet-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-violet-400"
                      }`}
                    >
                      <Icon size={18} />

                      {section.label}
                    </button>
                  );
                }
              )}

            </aside>

            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="min-w-0">

              {/* =================================================
                  PROFILE
              ================================================= */}

              {activeSection ===
                "profile" && (
                <SettingsCard
                  title="Profile"
                  description="Update your personal information."
                  icon={
                    <User size={20} />
                  }
                >

                  <div className="flex flex-col items-center gap-5 border-b border-zinc-100 pb-8 dark:border-zinc-800 sm:flex-row">

                    <div className="relative">

                      {profileImage ? (
                        <img
                          src={
                            profileImage
                          }
                          alt="Profile"
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-2xl font-bold text-white">
                          {getInitials(
                            userName
                          )}
                        </div>
                      )}

                      <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-violet-600 text-white shadow-sm transition hover:bg-violet-700 dark:border-zinc-900">

                        <Camera size={16} />

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={
                            handleProfileImage
                          }
                          className="hidden"
                        />

                      </label>

                    </div>

                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-white">
                        Profile picture
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Upload a JPG, PNG or WEBP image.
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        Maximum size: 2 MB
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        Recommended size: 400 × 400
                      </p>
                    </div>

                  </div>

                  <div className="mt-8 grid gap-5">

                    <div>
                      <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        Full name
                      </label>

                      <input
                        type="text"
                        value={
                          nameInput
                        }
                        onChange={(
                          event
                        ) =>
                          setNameInput(
                            event.target.value
                          )
                        }
                        className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        Email address
                      </label>

                      <input
                        type="email"
                        value={email}
                        disabled
                        className="mt-2 h-12 w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-500 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                      />

                      <p className="mt-1 text-xs text-zinc-400">
                        Email changes can be added with account verification later.
                      </p>
                    </div>

                  </div>

                  {saveError && (
                    <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
                      {saveError}
                    </div>
                  )}

                  {saveMessage && (
                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
                      <Check size={17} />
                      {saveMessage}
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">

                    <button
                      type="button"
                      onClick={
                        handleSaveProfile
                      }
                      disabled={
                        isSavingProfile
                      }
                      className="flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={17} />

                      {isSavingProfile
                        ? "Saving..."
                        : "Save changes"}
                    </button>

                  </div>

                </SettingsCard>
              )}

              {/* =================================================
                  APPEARANCE
              ================================================= */}

              {activeSection ===
                "appearance" && (
                <SettingsCard
                  title="Appearance"
                  description="Customize how BrainDump AI looks."
                  icon={
                    <Palette size={20} />
                  }
                >

                  <div>
                    <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      Theme
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Choose how the application should appear.
                    </p>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">

                    <ThemeOption
                      selected={
                        theme === "light"
                      }
                      icon={
                        <Sun size={22} />
                      }
                      title="Light"
                      description="Bright and clean"
                      onClick={() =>
                        handleThemeChange(
                          "light"
                        )
                      }
                    />

                    <ThemeOption
                      selected={
                        theme === "dark"
                      }
                      icon={
                        <Moon size={22} />
                      }
                      title="Dark"
                      description="Easy on the eyes"
                      onClick={() =>
                        handleThemeChange(
                          "dark"
                        )
                      }
                    />

                    <ThemeOption
                      selected={
                        theme === "system"
                      }
                      icon={
                        <Palette size={22} />
                      }
                      title="System"
                      description="Follow device"
                      onClick={() =>
                        handleThemeChange(
                          "system"
                        )
                      }
                    />

                  </div>

                  <div className="mt-6 rounded-xl bg-violet-50 p-4 text-sm text-violet-700 dark:bg-violet-950/30 dark:text-violet-300">
                    <strong>Current theme:</strong>{" "}
                    {theme === "system"
                      ? "System"
                      : theme === "dark"
                        ? "Dark"
                        : "Light"}
                  </div>

                </SettingsCard>
              )}

              {/* =================================================
                  NOTIFICATIONS
              ================================================= */}

              {activeSection ===
                "notifications" && (
                <SettingsCard
                  title="Notifications"
                  description="Choose which notifications you want to receive."
                  icon={
                    <Bell size={20} />
                  }
                >

                  <ToggleSetting
                    title="Task reminders"
                    description="Get reminders about upcoming and unfinished tasks."
                    checked={
                      taskNotifications
                    }
                    onChange={(value) => {
                      setTaskNotifications(
                        value
                      );

                      updateNotification(
                        "taskNotifications",
                        value
                      );
                    }}
                  />

                  <ToggleSetting
                    title="AI notifications"
                    description="Receive useful AI-generated insights and suggestions."
                    checked={
                      aiNotifications
                    }
                    onChange={(value) => {
                      setAiNotifications(
                        value
                      );

                      updateNotification(
                        "aiNotifications",
                        value
                      );
                    }}
                  />

                  <ToggleSetting
                    title="Daily summary"
                    description="Receive a summary of your tasks and productivity."
                    checked={
                      dailySummary
                    }
                    onChange={(value) => {
                      setDailySummary(
                        value
                      );

                      updateNotification(
                        "dailySummary",
                        value
                      );
                    }}
                  />

                </SettingsCard>
              )}

              {/* =================================================
                  AI
              ================================================= */}

              {activeSection ===
                "ai" && (
                <SettingsCard
                  title="AI Preferences"
                  description="Control how BrainDump AI helps you."
                  icon={
                    <Brain size={20} />
                  }
                >

                  <ToggleSetting
                    title="AI suggestions"
                    description="Allow BrainDump AI to suggest improvements to your tasks."
                    checked={
                      aiSuggestions
                    }
                    onChange={(value) => {
                      setAiSuggestions(
                        value
                      );

                      updateNotification(
                        "aiSuggestions",
                        value
                      );
                    }}
                  />

                  <ToggleSetting
                    title="Smart priorities"
                    description="Allow AI to help identify which tasks deserve your attention first."
                    checked={
                      smartPriorities
                    }
                    onChange={(value) => {
                      setSmartPriorities(
                        value
                      );

                      updateNotification(
                        "smartPriorities",
                        value
                      );
                    }}
                  />

                </SettingsCard>
              )}

              {/* =================================================
                  SECURITY
              ================================================= */}

              {activeSection ===
                "security" && (
                <SettingsCard
                  title="Security"
                  description="Manage your password and account security."
                  icon={
                    <Shield size={20} />
                  }
                >

                  <form
                    onSubmit={
                      handlePasswordChange
                    }
                  >

                    <div className="space-y-5">

                      <PasswordInput
                        label="Current password"
                        value={
                          currentPassword
                        }
                        onChange={
                          setCurrentPassword
                        }
                      />

                      <PasswordInput
                        label="New password"
                        value={
                          newPassword
                        }
                        onChange={
                          setNewPassword
                        }
                      />

                      <PasswordInput
                        label="Confirm new password"
                        value={
                          confirmPassword
                        }
                        onChange={
                          setConfirmPassword
                        }
                      />

                    </div>

                    {passwordError && (
                      <div className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
                        {passwordError}
                      </div>
                    )}

                    {passwordMessage && (
                      <div className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:bg-green-950/40 dark:text-green-400">
                        <Check size={17} />
                        {passwordMessage}
                      </div>
                    )}

                    <div className="mt-6 flex justify-end">

                      <button
                        type="submit"
                        disabled={
                          isChangingPassword
                        }
                        className="flex h-11 items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Lock size={17} />

                        {isChangingPassword
                          ? "Updating..."
                          : "Update password"}
                      </button>

                    </div>

                  </form>

                  <div className="mt-8 border-t border-zinc-100 pt-6 dark:border-zinc-800">

                    <h3 className="font-semibold text-zinc-900 dark:text-white">
                      Sign out
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Sign out of this BrainDump AI account on this device.
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="mt-4 flex h-11 items-center gap-2 rounded-xl border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <LogOut size={17} />

                      Log out
                    </button>

                  </div>

                </SettingsCard>
              )}

              {/* =================================================
                  DANGER ZONE
              ================================================= */}

              {activeSection ===
                "danger" && (
                <div className="rounded-2xl border border-red-200 bg-white shadow-sm dark:border-red-900/60 dark:bg-zinc-900">

                  <div className="border-b border-red-100 p-6 dark:border-red-900/40">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/40">
                        <Trash2 size={20} />
                      </div>

                      <div>
                        <h2 className="font-bold text-zinc-900 dark:text-white">
                          Danger Zone
                        </h2>

                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                          These actions can permanently affect your account.
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="p-6">

                    <div className="rounded-xl bg-red-50 p-5 dark:bg-red-950/30">

                      <h3 className="font-bold text-red-700 dark:text-red-400">
                        Delete your account
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-red-600 dark:text-red-400">
                        Permanently delete your account, tasks and associated data. This action cannot be undone.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setShowDeleteModal(
                            true
                          )
                        }
                        className="mt-5 flex h-11 items-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700"
                      >
                        <Trash2 size={17} />

                        Delete account
                      </button>

                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </main>

      {/* =================================================
          DELETE MODAL
      ================================================= */}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-6">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
              <Trash2 size={22} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-zinc-900 dark:text-white">
              Delete account?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              This will permanently delete your BrainDump AI account and all associated tasks. This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setShowDeleteModal(
                    false
                  )
                }
                disabled={
                  isDeletingAccount
                }
                className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleDeleteAccount
                }
                disabled={
                  isDeletingAccount
                }
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeletingAccount
                  ? "Deleting..."
                  : "Delete account"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

type SettingsHeaderProps = {
  navigate: ReturnType<typeof useNavigate>;
};

function SettingsHeader({
  navigate,
}: SettingsHeaderProps) {
  return (
    <header className="flex h-20 items-center border-b border-zinc-200 bg-white px-6 transition-colors dark:border-zinc-800 dark:bg-zinc-900 lg:px-10">

      <button
        type="button"
        onClick={() =>
          navigate("/dashboard")
        }
        className="mr-4 flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
        aria-label="Back to dashboard"
      >
        <ArrowLeft size={20} />
      </button>

      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Settings
        </h1>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your account and preferences.
        </p>
      </div>

    </header>
  );
}

/* =========================================================
   SETTINGS CARD
========================================================= */

type SettingsCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
};

function SettingsCard({
  title,
  description,
  icon,
  children,
}: SettingsCardProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900">

      <div className="border-b border-zinc-100 p-6 dark:border-zinc-800">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
            {icon}
          </div>

          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {title}
            </h2>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          </div>

        </div>

      </div>

      <div className="p-6">
        {children}
      </div>

    </section>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

type ToggleSettingProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
};

function ToggleSetting({
  title,
  description,
  checked,
  onChange,
}: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-zinc-100 py-5 first:pt-0 last:border-0 last:pb-0 dark:border-zinc-800">

      <div>
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {title}
        </h3>

        <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!checked)
        }
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-violet-600"
            : "bg-zinc-300 dark:bg-zinc-700"
        }`}
        aria-label={title}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}

/* =========================================================
   THEME OPTION
========================================================= */

type ThemeOptionProps = {
  selected: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
};

function ThemeOption({
  selected,
  icon,
  title,
  description,
  onClick,
}: ThemeOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100 dark:border-violet-500 dark:bg-violet-950/30 dark:ring-violet-900/30"
          : "border-zinc-200 hover:border-violet-200 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:border-violet-700 dark:hover:bg-zinc-800"
      }`}
    >

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          selected
            ? "bg-violet-600 text-white"
            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
        }`}
      >
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-bold text-zinc-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {description}
      </p>

    </button>
  );
}

/* =========================================================
   PASSWORD INPUT
========================================================= */

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
};

function PasswordInput({
  label,
  value,
  onChange,
}: PasswordInputProps) {
  return (
    <div>

      <label className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        {label}
      </label>

      <input
        type="password"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
      />

    </div>
  );
}

/* =========================================================
   INITIALS
========================================================= */

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
    parts[parts.length - 1][0]
  ).toUpperCase();
}

export default SettingsPage;