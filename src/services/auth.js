export const auth = {
  session: () => {
    try {
      const raw = window.localStorage.getItem('resqgrid.session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};
