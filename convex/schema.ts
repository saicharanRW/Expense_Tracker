import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
 
 
 
export default defineSchema({
  expenses: defineTable({
    amount: v.number(),
    category: v.string(),
    description: v.string(),
    date: v.string(),
  }),
});