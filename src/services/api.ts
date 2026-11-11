// const API_URL = "http://localhost:5000/api";
const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

/* =========================================================
   TYPES
========================================================= */

export type Priority =
  | "High"
  | "Medium"
  | "Low";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  profileImage: string;
};

export type ApiTask = {
  _id: string;
  user: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/* =========================================================
   AUTH HEADERS
========================================================= */

function getAuthHeaders(): HeadersInit {
  const token =
    localStorage.getItem("token");

  return {
    "Content-Type": "application/json",

    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
}

/* =========================================================
   RESPONSE HANDLER
========================================================= */

async function handleResponse(
  response: Response
) {
  let data: any = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  /*
    Authentication failed.

    Don't automatically delete the token here.
    The user may want to see the actual error,
    and ProtectedRoute can handle navigation.
  */

  if (response.status === 401) {
    throw new Error(
      data.message ||
        "Not authorized. Please log in again."
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong."
    );
  }

  return data;
}

/* =========================================================
   AUTH
========================================================= */

/* =========================
   SIGNUP
========================= */

export async function signupUser(
  name: string,
  email: string,
  password: string
) {
  const response =
    await fetch(
      `${API_URL}/auth/signup`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

  return handleResponse(
    response
  );
}

/* =========================
   LOGIN
========================= */

export async function loginUser(
  email: string,
  password: string
) {
  const response =
    await fetch(
      `${API_URL}/auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

  return handleResponse(
    response
  );
}

/* =========================================================
   CURRENT USER
========================================================= */

export async function getCurrentUser(): Promise<ApiUser> {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const response =
    await fetch(
      `${API_URL}/auth/me`,
      {
        method: "GET",

        headers:
          getAuthHeaders(),
      }
    );

  const data =
    await handleResponse(
      response
    );

  if (!data.user) {
    throw new Error(
      "User information was not returned by the server."
    );
  }

  return {
    id:
      data.user.id ||
      data.user._id,

    name:
      data.user.name || "",

    email:
      data.user.email || "",

    profileImage:
      data.user.profileImage ||
      "",
  };
}

/* =========================================================
   UPDATE PROFILE
========================================================= */

export async function updateProfile(
  profileData: {
    name?: string;
    profileImage?: string;
  }
): Promise<ApiUser> {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const response =
    await fetch(
      `${API_URL}/auth/profile`,
      {
        method: "PATCH",

        headers:
          getAuthHeaders(),

        body: JSON.stringify({
          name:
            profileData.name,

          profileImage:
            profileData.profileImage,
        }),
      }
    );

  const data =
    await handleResponse(
      response
    );

  if (!data.user) {
    throw new Error(
      "Updated user information was not returned by the server."
    );
  }

  return {
    id:
      data.user.id ||
      data.user._id,

    name:
      data.user.name || "",

    email:
      data.user.email || "",

    profileImage:
      data.user.profileImage ||
      "",
  };
}

/* =========================================================
   CHANGE PASSWORD
========================================================= */

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const response =
    await fetch(
      `${API_URL}/auth/password`,
      {
        method: "PATCH",

        headers:
          getAuthHeaders(),

        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }
    );

  await handleResponse(
    response
  );
}

/* =========================================================
   DELETE ACCOUNT
========================================================= */

export async function deleteAccount(): Promise<void> {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const response =
    await fetch(
      `${API_URL}/auth/account`,
      {
        method: "DELETE",

        headers:
          getAuthHeaders(),
      }
    );

  await handleResponse(
    response
  );
}

/* =========================================================
   TASK HELPERS
========================================================= */

/*
  MongoDB normally returns:

  _id

  but this also accepts id so the
  frontend remains tolerant of either
  response format.
*/

function mapTask(
  task: any
): ApiTask {
  return {
    _id:
      task._id ||
      task.id ||
      "",

    user:
      task.user?._id ||
      task.user ||
      "",

    title:
      task.title || "",

    description:
      task.description || "",

    category:
      task.category || "",

    priority:
      task.priority || "Medium",

    dueDate:
      task.dueDate || "",

    completed:
      Boolean(
        task.completed
      ),

    createdAt:
      task.createdAt,

    updatedAt:
      task.updatedAt,
  };
}

/* =========================================================
   GET TASKS
========================================================= */

export async function getTasks(): Promise<
  ApiTask[]
> {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "User is not authenticated."
    );
  }

  /*
    IMPORTANT:

    The backend should determine the
    current user from the JWT.

    We do NOT send ?user=...
  */

  const response =
    await fetch(
      `${API_URL}/tasks`,
      {
        method: "GET",

        headers:
          getAuthHeaders(),
      }
    );

  const data =
    await handleResponse(
      response
    );

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map(
    mapTask
  );
}

/* =========================================================
   CREATE TASK
========================================================= */

export async function createTask(
  taskData: {
    title: string;
    description?: string;
    category: string;
    priority: Priority;
    dueDate?: string;
  }
): Promise<ApiTask> {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "User authentication failed. Please log in again."
    );
  }

  const response =
    await fetch(
      `${API_URL}/tasks`,
      {
        method: "POST",

        headers:
          getAuthHeaders(),

        /*
          IMPORTANT:

          We intentionally do NOT send
          user/userId here.

          The backend should get the
          user ID from req.userId after
          JWT authentication.
        */

        body: JSON.stringify({
          title:
            taskData.title,

          description:
            taskData.description ||
            "",

          category:
            taskData.category,

          priority:
            taskData.priority,

          dueDate:
            taskData.dueDate || "",
        }),
      }
    );

  const data =
    await handleResponse(
      response
    );

  return mapTask(data);
}

/* =========================================================
   TOGGLE TASK
========================================================= */

export async function toggleTaskAPI(
  id: string
): Promise<ApiTask> {
  if (!id) {
    throw new Error(
      "Task ID is required."
    );
  }

  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const response =
    await fetch(
      `${API_URL}/tasks/${id}/toggle`,
      {
        method: "PATCH",

        headers:
          getAuthHeaders(),
      }
    );

  const data =
    await handleResponse(
      response
    );

  return mapTask(data);
}

/* =========================================================
   DELETE TASK
========================================================= */

export async function deleteTaskAPI(
  id: string
): Promise<void> {
  if (!id) {
    throw new Error(
      "Task ID is required."
    );
  }

  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "User is not authenticated."
    );
  }

  const response =
    await fetch(
      `${API_URL}/tasks/${id}`,
      {
        method: "DELETE",

        headers:
          getAuthHeaders(),
      }
    );

  await handleResponse(
    response
  );
}