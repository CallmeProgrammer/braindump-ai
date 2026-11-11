import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Task from "../models/Task.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
  ===============================
  CREATE JWT TOKEN
  ===============================
*/

function createToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

/*
  ===============================
  FORMAT USER
  ===============================
*/

function formatUser(user) {
  return {
    id: user._id.toString(),

    name:
      user.name || "",

    email:
      user.email || "",

    profileImage:
      user.profileImage || "",
  };
}

/*
  ===============================
  SIGNUP
  ===============================
*/

router.post(
  "/signup",
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body || {};

      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Name, email and password are required",
        });
      }

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();

      /*
        Check existing user
      */

      const existingUser =
        await User.findOne({
          email:
            normalizedEmail,
        });

      if (existingUser) {
        return res.status(400).json({
          message:
            "User already exists",
        });
      }

      /*
        Hash password
      */

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      /*
        Create user
      */

      const user =
        await User.create({
          name:
            name.trim(),

          email:
            normalizedEmail,

          password:
            hashedPassword,

          profileImage:
            "",
        });

      /*
        Create JWT
      */

      const token =
        createToken(user);

      /*
        Send response
      */

      return res.status(201).json({
        message:
          "Account created successfully",

        token,

        user:
          formatUser(user),
      });
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

/*
  ===============================
  LOGIN
  ===============================
*/

router.post(
  "/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body || {};

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Email and password are required",
        });
      }

      const normalizedEmail =
        email
          .toLowerCase()
          .trim();

      /*
        Find user
      */

      const user =
        await User.findOne({
          email:
            normalizedEmail,
        });

      if (!user) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      /*
        Check password
      */

      const isPasswordCorrect =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message:
            "Invalid email or password",
        });
      }

      /*
        Create JWT
      */

      const token =
        createToken(user);

      /*
        Send response
      */

      return res.status(200).json({
        message:
          "Login successful",

        token,

        user:
          formatUser(user),
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      return res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

/*
  ===============================
  GET CURRENT USER
  ===============================

  GET /api/auth/me

  Requires:
  Authorization: Bearer <token>
*/

router.get(
  "/me",
  protect,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.userId
        ).select("-password");

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      return res.status(200).json({
        user:
          formatUser(user),
      });
    } catch (error) {
      console.error(
        "Get current user error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch user",
      });
    }
  }
);

/*
  ===============================
  UPDATE PROFILE
  ===============================

  PATCH /api/auth/profile

  Body:

  {
    "name": "Hrithik Kumar",
    "profileImage": "data:image/..."
  }

  Requires authentication.
*/

router.patch(
  "/profile",
  protect,
  async (req, res) => {
    try {
      const {
        name,
        profileImage,
      } = req.body || {};

      /*
        Find authenticated user
      */

      const user =
        await User.findById(
          req.userId
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      /*
        UPDATE NAME
      */

      if (
        typeof name ===
        "string"
      ) {
        const trimmedName =
          name.trim();

        if (!trimmedName) {
          return res.status(400).json({
            message:
              "Name cannot be empty",
          });
        }

        if (
          trimmedName.length >
          100
        ) {
          return res.status(400).json({
            message:
              "Name cannot exceed 100 characters",
          });
        }

        user.name =
          trimmedName;
      }

      /*
        UPDATE PROFILE IMAGE
      */

      if (
        typeof profileImage ===
        "string"
      ) {
        /*
          Empty string means:
          remove profile picture.
        */

        if (
          profileImage === ""
        ) {
          user.profileImage =
            "";
        } else {

          /*
            Make sure it is a data URL.

            We currently store the image
            directly in MongoDB.
          */

          const isDataImage =
            profileImage.startsWith(
              "data:image/"
            );

          if (!isDataImage) {
            return res.status(400).json({
              message:
                "Invalid profile image format",
            });
          }

          /*
            Prevent excessively large
            base64 images.

            5 MB maximum request value
            is intentionally conservative.
          */

          if (
            profileImage.length >
            5 * 1024 * 1024
          ) {
            return res.status(400).json({
              message:
                "Profile image is too large. Please use an image smaller than 5 MB.",
            });
          }

          user.profileImage =
            profileImage;
        }
      }

      /*
        SAVE USER
      */

      await user.save();

      /*
        Return updated user
      */

      return res.status(200).json({
        message:
          "Profile updated successfully",

        user:
          formatUser(user),
      });
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update profile",
      });
    }
  }
);

/*
  ===============================
  CHANGE PASSWORD
  ===============================

  PATCH /api/auth/password
*/

router.patch(
  "/password",
  protect,
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body || {};

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          message:
            "Current password and new password are required",
        });
      }

      if (
        newPassword.length <
        6
      ) {
        return res.status(400).json({
          message:
            "New password must be at least 6 characters",
        });
      }

      /*
        Find authenticated user
      */

      const user =
        await User.findById(
          req.userId
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      /*
        Verify current password
      */

      const isPasswordCorrect =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message:
            "Current password is incorrect",
        });
      }

      /*
        Prevent same password
      */

      const isSamePassword =
        await bcrypt.compare(
          newPassword,
          user.password
        );

      if (isSamePassword) {
        return res.status(400).json({
          message:
            "New password must be different from your current password",
        });
      }

      /*
        Hash new password
      */

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      await user.save();

      return res.status(200).json({
        message:
          "Password updated successfully",
      });
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update password",
      });
    }
  }
);

/*
  ===============================
  DELETE ACCOUNT
  ===============================

  DELETE /api/auth/account

  Deletes:
  - User
  - All user's tasks
*/

router.delete(
  "/account",
  protect,
  async (req, res) => {
    try {
      /*
        Find authenticated user
      */

      const user =
        await User.findById(
          req.userId
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      /*
        Delete all user's tasks
      */

      await Task.deleteMany({
        user:
          user._id,
      });

      /*
        Delete user
      */

      await User.findByIdAndDelete(
        user._id
      );

      return res.status(200).json({
        message:
          "Account deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete account error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to delete account",
      });
    }
  }
);

export default router;