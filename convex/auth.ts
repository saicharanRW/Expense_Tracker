import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get or create user from Google OAuth
export const getOrCreateUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    picture: v.optional(v.string()),
    googleId: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, name, picture, googleId } = args;

    // Check if user already exists by email or Google ID
    let existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!existingUser) {
      // Check by Google ID
      existingUser = await ctx.db
        .query("users")
        .withIndex("by_google_id", (q) => q.eq("googleId", googleId))
        .first();
    }

    if (existingUser) {
      // Update existing user with latest Google info
      const userId = existingUser._id;
      await ctx.db.patch(userId, {
        name,
        picture,
        googleId,
        isVerified: true,
        provider: "google",
      });
      return { ...existingUser, name, picture, googleId, isVerified: true, provider: "google" };
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        email,
        name,
        picture,
        isVerified: true,
        createdAt: Date.now(),
        provider: "google",
        googleId,
      });
      
      return {
        _id: userId,
        email,
        name,
        picture,
        isVerified: true,
        createdAt: Date.now(),
        provider: "google",
        googleId,
      };
    }
  },
});

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Get user by Google ID
export const getUserByGoogleId = query({
  args: { googleId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_google_id", (q) => q.eq("googleId", args.googleId))
      .first();
  },
});
