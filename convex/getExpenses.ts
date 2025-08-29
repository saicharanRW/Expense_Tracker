import { query } from "./_generated/server";

export const getExpenses = query({
  args: {},
  handler: async (ctx) => {
    const expenses = await ctx.db.query("expenses").collect();
    return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
});
