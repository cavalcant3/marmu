import { Platform } from "react-native";
import { MMKV as NativeMMKV } from "react-native-mmkv";

class WebStorage {
  private id: string;

  constructor(options?: { id: string; encrypt?: boolean }) {
    this.id = options?.id || "marmu-default";
  }

  set(key: string, value: string | number | boolean) {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(`${this.id}:${key}`, String(value));
    }
  }

  getString(key: string): string | undefined {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(`${this.id}:${key}`) || undefined;
    }
    return undefined;
  }

  delete(key: string) {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(`${this.id}:${key}`);
    }
  }
}

// Fallback if NativeMMKV is undefined (which is true on web platform)
export const MMKV = (Platform.OS === "web" || !NativeMMKV) ? WebStorage : NativeMMKV;
