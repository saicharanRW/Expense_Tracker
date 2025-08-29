import { query } from "./_generated/server";
import { v } from "convex/values";

export const getExpenses = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    // Get expenses for the specific user
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return expenses;
  },
});

// Get all expenses (for admin purposes or when userId is not available)
export const getAllExpenses = query({
  args: {},
  handler: async (ctx) => {
    const expenses = await ctx.db
      .query("expenses")
      .order("desc")
      .collect();

    return expenses;
  },
});
