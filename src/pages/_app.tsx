// import { ClerkProvider } from "@clerk/nextjs";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Router, { useRouter } from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Toaster } from "~/components/ui/toaster";
import { ModalProvider } from "~/providers/admin/modal-provider";
import { ToastProvider } from "~/providers/toast-provider";
import "~/styles/globals.css";
import { api } from "~/utils/api";

Router.events.on("routeChangeStart", (url) => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", (url) => {
  NProgress.done(false);
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ToastProvider />
      <ModalProvider />
      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
