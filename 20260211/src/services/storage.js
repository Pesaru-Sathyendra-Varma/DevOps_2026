const STORAGE_KEYS = {
  transactions: "pft_transactions",
  users: "pft_users",
  session: "pft_session",
  theme: "pft_theme"
};

const safeParse = (value, fallback) => {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

export const loadTransactions = () => {
  const data = safeParse(localStorage.getItem(STORAGE_KEYS.transactions), null);
  return Array.isArray(data) ? data : null;
};

export const saveTransactions = (transactions) => {
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
};

export const loadUsers = () => {
  const data = safeParse(localStorage.getItem(STORAGE_KEYS.users), []);
  return Array.isArray(data) ? data : [];
};

export const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
};

export const loadSession = () => {
  const data = safeParse(localStorage.getItem(STORAGE_KEYS.session), null);
  return data && data.username ? data : null;
};

export const saveSession = (session) => {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.session);
};

export const loadTheme = () => {
  const theme = localStorage.getItem(STORAGE_KEYS.theme);
  return theme === "dark" ? "dark" : "light";
};

export const saveTheme = (theme) => {
  localStorage.setItem(STORAGE_KEYS.theme, theme);
};
