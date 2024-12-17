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
import type * as assets from "../assets.js";
import type * as auth from "../auth.js";
import type * as channels from "../channels.js";
import type * as conversations from "../conversations.js";
import type * as documents from "../documents.js";
import type * as helpers from "../helpers.js";
import type * as http from "../http.js";
import type * as inviteCodes from "../inviteCodes.js";
import type * as labels from "../labels.js";
import type * as messages from "../messages.js";
import type * as projects from "../projects.js";
import type * as reactions from "../reactions.js";
import type * as reports from "../reports.js";
import type * as storages from "../storages.js";
import type * as subtasks from "../subtasks.js";
import type * as tasks from "../tasks.js";
import type * as teams from "../teams.js";
import type * as templates from "../templates.js";
import type * as upload from "../upload.js";
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
  assets: typeof assets;
  auth: typeof auth;
  channels: typeof channels;
  conversations: typeof conversations;
  documents: typeof documents;
  helpers: typeof helpers;
  http: typeof http;
  inviteCodes: typeof inviteCodes;
  labels: typeof labels;
  messages: typeof messages;
  projects: typeof projects;
  reactions: typeof reactions;
  reports: typeof reports;
  storages: typeof storages;
  subtasks: typeof subtasks;
  tasks: typeof tasks;
  teams: typeof teams;
  templates: typeof templates;
  upload: typeof upload;
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
