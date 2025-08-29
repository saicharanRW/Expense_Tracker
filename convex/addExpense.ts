import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addExpense = mutation({
  args: {
    amount: v.number(),
    category: v.string(),
    description: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("expenses", {
      amount: args.amount,
      category: args.category,
      description: args.description,
      date: args.date,
    });
    return await ctx.db.get(id);
  },
});
