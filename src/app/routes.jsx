export const roles = Object.freeze({
  citizen: 'citizen',
  agency: 'agency',
  admin: 'admin',
});

export const paths = Object.freeze({
  login: '/login',
  citizen: '/citizen',
  agency: '/agency',
  admin: '/admin',
});

export function pathForRole(role) {
  return paths[role] || paths.login;
}

export function roleForPath(pathname) {
  if (pathname.startsWith(paths.citizen)) return roles.citizen;
  if (pathname.startsWith(paths.agency)) return roles.agency;
  if (pathname.startsWith(paths.admin)) return roles.admin;
  return null;
}
