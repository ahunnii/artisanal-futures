import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import ToastNotificationProvider from "~/apps/notifications/toast-notification-provider";
import { ModalProvider } from "~/providers/admin/modal-provider";

import "~/styles/globals.css";
import { api } from "~/utils/api";

Router.events.on("routeChangeStart", () => {
  NProgress.start();
});

Router.events.on("routeChangeComplete", () => {
  NProgress.done(false);
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ToastNotificationProvider />
      <ModalProvider />
      <Component {...pageProps} />
      <SpeedInsights />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
