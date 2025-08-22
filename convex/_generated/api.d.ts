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
import type * as constants from "../constants.js";
import type * as helper from "../helper.js";
import type * as mutations from "../mutations.js";
import type * as queries from "../queries.js";
import type * as tables_champions from "../tables/champions.js";
import type * as tables_games from "../tables/games.js";
import type * as tables_interfaces from "../tables/interfaces.js";
import type * as tables_users from "../tables/users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  constants: typeof constants;
  helper: typeof helper;
  mutations: typeof mutations;
  queries: typeof queries;
  "tables/champions": typeof tables_champions;
  "tables/games": typeof tables_games;
  "tables/interfaces": typeof tables_interfaces;
  "tables/users": typeof tables_users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
