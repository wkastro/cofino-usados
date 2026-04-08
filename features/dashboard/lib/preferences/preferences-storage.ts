"use client";

import { setValueToCookie } from "@/features/dashboard/server/preferences.actions";

import { setClientCookie } from "../cookie.client";
import { setLocalStorageValue } from "../local-storage.client";
import { PREFERENCE_PERSISTENCE, type PreferenceKey } from "./preferences-config";

const COOKIE_PREFIX = "db_";

export async function persistPreference(key: PreferenceKey, value: string) {
  const mode = PREFERENCE_PERSISTENCE[key];
  const prefixedKey = `${COOKIE_PREFIX}${key}`;

  switch (mode) {
    case "none":
      return;

    case "client-cookie":
      setClientCookie(prefixedKey, value);
      return;

    case "server-cookie":
      await setValueToCookie(prefixedKey, value);
      return;

    case "localStorage":
      setLocalStorageValue(prefixedKey, value);
      return;

    default:
      return;
  }
}
