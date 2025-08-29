/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as addExpense from "../addExpense.js";
import type * as auth from "../auth.js";
import type * as cleanupOrphanedExpenses from "../cleanupOrphanedExpenses.js";
import type * as env from "../env.js";
import type * as getExpenses from "../getExpenses.js";
import type * as migrate from "../migrate.js";
import type * as migrateExpenses from "../migrateExpenses.js";
import type * as sendEmail from "../sendEmail.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  addExpense: typeof addExpense;
  auth: typeof auth;
  cleanupOrphanedExpenses: typeof cleanupOrphanedExpenses;
  env: typeof env;
  getExpenses: typeof getExpenses;
  migrate: typeof migrate;
  migrateExpenses: typeof migrateExpenses;
  sendEmail: typeof sendEmail;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
