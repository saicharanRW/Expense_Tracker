import { mutation } from "./_generated/server";

export const migrateExpenses = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all expenses that don't have a userId or createdAt
    const expenses = await ctx.db.query("expenses").collect();
    
    let migratedCount = 0;
    
    for (const expense of expenses) {
      const updates: any = {};
      let needsUpdate = false;
      
      // Add createdAt if missing
      if (expense.createdAt === undefined) {
        updates.createdAt = Date.now();
        needsUpdate = true;
      }
      
      // If expense has no userId, we can either delete it or assign it to a default user
      // For now, we'll skip expenses without userId to avoid data corruption
      if (expense.userId === undefined) {
        console.log(`Skipping expense ${expense._id} - no userId`);
        continue;
      }
      
      if (needsUpdate) {
        await ctx.db.patch(expense._id, updates);
        migratedCount++;
      }
    }
    
    return { 
      success: true, 
      message: `Migrated ${migratedCount} expenses`,
      totalExpenses: expenses.length
    };
  },
});
