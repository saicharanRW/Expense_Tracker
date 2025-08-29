import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addExpense = mutation({
  args: {
    amount: v.number(),
    description: v.string(),
    category: v.string(),
    date: v.string(),
    userId: v.id("users"), // Now required for new expenses
  },
  handler: async (ctx, args) => {
    const { amount, description, category, date, userId } = args;

    // Verify user exists
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Add the expense
    const expenseId = await ctx.db.insert("expenses", {
      userId,
      amount,
      description,
      category,
      date,
      createdAt: Date.now(),
    });

    return { id: expenseId };
  },
});
