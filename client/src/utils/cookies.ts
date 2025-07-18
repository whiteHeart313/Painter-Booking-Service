import Cookies from 'js-cookie';

// Cookie utility functions using js-cookie
export const setCookie = (name: string, value: string, days: number = 7) => {
  Cookies.set(name, value, { 
    expires: days,
    secure: true,
    sameSite: 'lax'
  });
};

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const removeCookie = (name: string) => {
  Cookies.remove(name);
};

export const clearAllCookies = () => {
  // Get all cookie names
  const allCookies = Cookies.get();
  
  // Remove each cookie
  Object.keys(allCookies).forEach(cookieName => {
    Cookies.remove(cookieName);
  });
};
