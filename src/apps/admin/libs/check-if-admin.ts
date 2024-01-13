import { GetServerSidePropsContext } from "next";
import { User } from "next-auth";
import { getServerAuthSession } from "~/server/auth";

const checkIfAdmin = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerAuthSession(ctx);

  return true;
};

const redirectIfNotAdmin = (user: User) => {
  const userRole = user.role;

  if (userRole !== "ADMIN")
    return {
      redirect: {
        destination: "/unauthorized",
        permanent: false,
      },
    };
  return;
};
