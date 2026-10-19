const TOKEN_KEY = "token";
const USER_KEY = "user";

export const getAuthToken = () => sessionStorage.getItem(TOKEN_KEY);

export const getStoredUser = () => {
  const storedUser = sessionStorage.getItem(USER_KEY);
  if (!storedUser || storedUser === "undefined") return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    sessionStorage.removeItem(USER_KEY);
    return null;
  }
};

export const saveAuthSession = (token, user) => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const clearAuthSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
