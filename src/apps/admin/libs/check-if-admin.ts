import type { User } from "next-auth";

export const checkIfAdmin = (user: User) => {
  const userRole = user.role;
  return userRole === "ADMIN";
};
