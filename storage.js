function safeParseStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);

    if (value === null) {
      return fallback;
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}
