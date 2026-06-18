export function getUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function handleAuthError(err, navigate) {
  if (
    err.message === "Access token missing" ||
    err.message === "Invalid or expired token"
  ) {
    localStorage.removeItem("token");
    navigate("/login");
    return true;
  }
  return false;
}
