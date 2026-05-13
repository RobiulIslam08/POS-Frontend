/**
 * Settings Service
 * Get and update system settings.
 */

import { apiGet, apiPatch } from "./api";

const BASE = "/settings";

export const settingsService = {
  /** Get current system settings. */
  get() {
    return apiGet(BASE);
  },

  /** Update system settings (admin only). */
  update(data) {
    return apiPatch(BASE, data);
  },
};
