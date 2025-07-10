import Cookies from "js-cookie";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_EXPIRATION_DAYS,
} from "~/constants/auth";

export const getAccessTokenFromCookie = (): string | null => {
  return Cookies.get(ACCESS_TOKEN_COOKIE_NAME) || null;
};

export const setAccessTokenInCookie = (token: string): void => {
  Cookies.set(ACCESS_TOKEN_COOKIE_NAME, token, {
    expires: ACCESS_TOKEN_EXPIRATION_DAYS,
  });
};

export const removeAccessTokenCookie = (): void => {
  Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
};

export function getAvatarShortName(firstName: string, lastName: string) {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}
