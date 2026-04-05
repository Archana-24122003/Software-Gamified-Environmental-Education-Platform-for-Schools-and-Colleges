"use client";

import { getDemoUser } from "@/lib/auth";

const LEGACY_MIGRATIONS_KEY = "learnbee_storage_migrations";
const OLD_LEGACY_MIGRATIONS_KEY = "envimission_storage_migrations";

type MigrationMap = Record<string, boolean>;

function readMigrationMap() {
  if (typeof window === "undefined") {
    return {} as MigrationMap;
  }

  const raw = localStorage.getItem(LEGACY_MIGRATIONS_KEY);
  const legacyRaw = localStorage.getItem(OLD_LEGACY_MIGRATIONS_KEY);

  if (!raw && !legacyRaw) {
    return {} as MigrationMap;
  }

  try {
    return JSON.parse(raw ?? legacyRaw ?? "{}") as MigrationMap;
  } catch {
    return {} as MigrationMap;
  }
}

function saveMigrationMap(value: MigrationMap) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(LEGACY_MIGRATIONS_KEY, JSON.stringify(value));
}

export function getStorageScopeUserEmail() {
  if (typeof window === "undefined") {
    return null;
  }

  return getDemoUser()?.email?.trim().toLowerCase() ?? null;
}

export function createScopedStorageKey(baseKey: string, email?: string | null) {
  const normalizedEmail = email?.trim().toLowerCase();
  return normalizedEmail ? `${baseKey}:${normalizedEmail}` : baseKey;
}

export function getScopedStorageKey(baseKey: string, email?: string | null) {
  return createScopedStorageKey(baseKey, email ?? getStorageScopeUserEmail());
}

export function migrateLegacyStorageKey(baseKey: string, email?: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return;
  }

  const migrationId = `${baseKey}:${normalizedEmail}`;
  const migrations = readMigrationMap();

  if (migrations[migrationId]) {
    return;
  }

  const scopedKey = createScopedStorageKey(baseKey, normalizedEmail);
  const scopedValue = localStorage.getItem(scopedKey);
  const legacyValue = localStorage.getItem(baseKey);

  if (!scopedValue && legacyValue) {
    localStorage.setItem(scopedKey, legacyValue);
  }

  migrations[migrationId] = true;
  saveMigrationMap(migrations);
}
