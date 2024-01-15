export const redirectIfUnauthorized = () => {
  return {
    redirect: {
      destination: "/unauthorized",
      permanent: false,
    },
  };
};

export const redirectIfNoSession = (resolvedUrl: string) => {
  return {
    redirect: {
      destination: "/sign-in?redirect_url=" + resolvedUrl,
      permanent: false,
    },
  };
};

export const redirectIfNotSignedIn = (resolvedUrl: string) => {
  return {
    redirect: {
      destination: `/api/auth/signin?callbackUrl=${encodeURIComponent(
        resolvedUrl
      )}`,
      permanent: false,
    },
  };
};
