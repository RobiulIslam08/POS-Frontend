/**
 * User Service
 * User management operations.
 */

import { apiGet, apiPost, apiPatch, apiDelete } from "./api";

const BASE = "/users";

export const userService = {
  /** Get all users. */
  getAll(params = {}) {
    return apiGet(BASE, params);
  },

  /** Get a single user by ID. */
  getById(id) {
    return apiGet(`${BASE}/${id}`);
  },

  /** Update a user by ID. */
  update(id, data) {
    return apiPatch(`${BASE}/${id}`, data);
  },

  /** Delete a user by ID. */
  delete(id) {
    return apiDelete(`${BASE}/${id}`);
  },
};
