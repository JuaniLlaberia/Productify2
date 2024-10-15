/* prettier-ignore-start */

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
import type * as auth from "../auth.js";
import type * as channels from "../channels.js";
import type * as documents from "../documents.js";
import type * as http from "../http.js";
import type * as messages from "../messages.js";
import type * as projects from "../projects.js";
import type * as reports from "../reports.js";
import type * as resources from "../resources.js";
import type * as tasks from "../tasks.js";
import type * as teams from "../teams.js";
import type * as templates from "../templates.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  channels: typeof channels;
  documents: typeof documents;
  http: typeof http;
  messages: typeof messages;
  projects: typeof projects;
  reports: typeof reports;
  resources: typeof resources;
  tasks: typeof tasks;
  teams: typeof teams;
  templates: typeof templates;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
