import { mutation } from "./_generated/server";

export const cleanupOrphanedExpenses = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all expenses without userId
    const expenses = await ctx.db.query("expenses").collect();
    const orphanedExpenses = expenses.filter(expense => expense.userId === undefined);
    
    let deletedCount = 0;
    
    for (const expense of orphanedExpenses) {
      await ctx.db.delete(expense._id);
      deletedCount++;
    }
    
    return { 
      success: true, 
      message: `Deleted ${deletedCount} orphaned expenses`,
      totalOrphaned: orphanedExpenses.length
    };
  },
});
