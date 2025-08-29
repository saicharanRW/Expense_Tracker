import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
 
 
 
export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()), // Optional for existing users
    picture: v.optional(v.string()),
    isVerified: v.boolean(),
    createdAt: v.number(),
    provider: v.optional(v.string()), // Optional for existing users
    googleId: v.optional(v.string()), // Google's unique user ID
  })
    .index("by_email", ["email"])
    .index("by_google_id", ["googleId"]),

  expenses: defineTable({
    userId: v.optional(v.id("users")), // Optional for existing records
    amount: v.number(),
    description: v.string(),
    category: v.string(),
    date: v.string(),
    createdAt: v.optional(v.number()), // Optional for existing records
  })
    .index("by_user", ["userId"])
    .index("by_user_date", ["userId", "date"]),
});