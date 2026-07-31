export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3010";
export const APP_NAME = "Marmu";
export const USE_LOCAL_DB = process.env.EXPO_PUBLIC_USE_LOCAL_DB !== undefined
  ? process.env.EXPO_PUBLIC_USE_LOCAL_DB === "true"
  : true;

