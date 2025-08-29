import { mutation } from "./_generated/server";

// Migration function to update existing records
export const migrateExistingData = mutation({
  args: {},
  handler: async (ctx) => {
    let results = {
      usersUpdated: 0,
      expensesUpdated: 0,
      totalUsers: 0,
      totalExpenses: 0
    };

    // Migrate existing users
    const users = await ctx.db.query("users").collect();
    results.totalUsers = users.length;
    
    for (const user of users) {
      const updates: any = {};
      
      // Add missing fields for existing users
      if (!user.name) {
        updates.name = user.email.split('@')[0]; // Use email prefix as name
      }
      
      if (!user.provider) {
        updates.provider = "legacy"; // Mark as legacy user
      }
      
      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(user._id, updates);
        results.usersUpdated++;
      }
    }

    // Migrate existing expenses
    const expenses = await ctx.db.query("expenses").collect();
    results.totalExpenses = expenses.length;
    
    for (const expense of expenses) {
      const updates: any = {};
      
      // Add createdAt if missing
      if (!expense.createdAt) {
        updates.createdAt = Date.now();
      }
      
      // Note: userId will remain null for existing expenses
      // Users can be assigned later when they log in
      
      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(expense._id, updates);
        results.expensesUpdated++;
      }
    }
    
    return results;
  },
});
