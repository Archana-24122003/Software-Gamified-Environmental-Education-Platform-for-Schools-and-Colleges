export type DemoUser = {
  name: string;
  email: string;
  role: "student" | "teacher";
  institutionName?: string;
  institutionCode?: string;
};

export type StoredAccount = DemoUser & { password: string };

const CURRENT_USER_KEY = "learnbee_user";
const LEGACY_CURRENT_USER_KEY = "envimission_user";
const ACCOUNTS_KEY = "learnbee_accounts";
const LEGACY_ACCOUNTS_KEY = "envimission_accounts";
export const AUTH_STATE_EVENT = "learnbeeAuthChanged";

function migrateLegacyAuthStorage() {
  if (typeof window === "undefined") return;

  const currentUser = localStorage.getItem(CURRENT_USER_KEY);
  const legacyCurrentUser = localStorage.getItem(LEGACY_CURRENT_USER_KEY);
  if (!currentUser && legacyCurrentUser) {
    localStorage.setItem(CURRENT_USER_KEY, legacyCurrentUser);
  }

  const accounts = localStorage.getItem(ACCOUNTS_KEY);
  const legacyAccounts = localStorage.getItem(LEGACY_ACCOUNTS_KEY);
  if (!accounts && legacyAccounts) {
    localStorage.setItem(ACCOUNTS_KEY, legacyAccounts);
  }
}

function loadAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return [];
  migrateLegacyAuthStorage();
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredAccount[];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function saveCurrentUser(user: DemoUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_STATE_EVENT));
}

export function getAccounts() {
  return loadAccounts();
}

export function getDemoUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  migrateLegacyAuthStorage();
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

export function logoutDemo() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event(AUTH_STATE_EVENT));
}

export function signupDemo(input: {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  institutionName?: string;
  institutionCode?: string;
}): { ok: true; message: string } | { ok: false; error: string } {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const institutionName = input.institutionName?.trim() ?? "";
  const institutionCode = input.institutionCode?.trim() ?? "";
  const validInstitutions = [
  { name: "Presidency University", code: "U-0104" },
];

const valid = validInstitutions.some(
  (inst) =>
    inst.name.toLowerCase() === institutionName.toLowerCase() &&
    inst.code === institutionCode
);

if (input.role === "teacher" && !valid) {
  return { ok: false, error: "Invalid institution details." };
}

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!email) return { ok: false, error: "Please enter your email." };
  if (input.role === "teacher" && !institutionName) {
    return { ok: false, error: "Please enter your institution name." };
  }
  if (input.role === "teacher" && !institutionCode) {
    return { ok: false, error: "Please enter your institution code." };
  }
  if (password.length < 6)
    return { ok: false, error: "Password must be at least 6 characters." };

  const accounts = loadAccounts();
  const existingAccount = accounts.find((a) => a.email === email);

if (existingAccount) {
  if (existingAccount.role !== input.role) {
    return {
      ok: false,
      error: `This email is already registered as a ${existingAccount.role}. Please login using that role.`,
    };
  }

  return {
    ok: false,
    error: "Account already exists. Please login.",
  };
}

  accounts.push({
    name,
    email,
    role: input.role,
    institutionName: institutionName || undefined,
    institutionCode: institutionCode || undefined,
    password,
  });
  saveAccounts(accounts);

  return {
    ok: true,
    message:
      "Signup successful! Please log in with your selected role to access your dashboard.",
  };
}

export function loginWithEmail(input: {
  email: string;
  password: string;
  role: "student" | "teacher";
}): { ok: true; role: DemoUser["role"] } | { ok: false; error: string } {
  const email = input.email.trim().toLowerCase();
  const password = input.password;
  const role = input.role;

  if (!email) return { ok: false, error: "Please enter your email." };
  if (!password) return { ok: false, error: "Please enter your password." };

  const accounts = loadAccounts();
  const acc = accounts.find((a) => a.email === email && a.role === role);
  const accountWithEmail = accounts.find((a) => a.email === email);

  if (!accountWithEmail) {
    return { ok: false, error: "No account found. Please sign up." };
  }

  if (!acc) {
    return {
      ok: false,
      error: `This account is registered as a ${accountWithEmail.role}. Please login using that role.`,
    };
  }

  if (acc.password !== password) return { ok: false, error: "Wrong password." };

  saveCurrentUser({
    name: acc.name,
    email: acc.email,
    role: acc.role,
    institutionName: acc.institutionName,
    institutionCode: acc.institutionCode,
  });
  return { ok: true, role: acc.role };
}

export function resetPassword(input: {
  email: string;
  newPassword: string;
  role: "student" | "teacher";
}): { ok: true } | { ok: false; error: string } {
  const email = input.email.trim().toLowerCase();
  const newPassword = input.newPassword;

  if (!email) return { ok: false, error: "Please enter your email." };
  if (newPassword.length < 6)
    return { ok: false, error: "New password must be at least 6 characters." };

  const accounts = loadAccounts();
  const acc = accounts.find((a) => a.email === email);

if (!acc) {
  return { ok: false, error: "No account found with this email." };
}

if (acc.role !== input.role) {
  return {
    ok: false,
    error: `This account is registered as a ${acc.role}.`,
  };
}

  const idx = accounts.findIndex((a) => a.email === email);
  if (idx === -1) return { ok: false, error: "No account found with this email." };

  accounts[idx] = { ...accounts[idx], password: newPassword };
  saveAccounts(accounts);

  return { ok: true };
}

export function getDashboardRoute(role?: DemoUser["role"] | null) {
  return role === "teacher" ? "/teacher-dashboard" : "/student-dashboard";
}
