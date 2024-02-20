import Head from "next/head";

import Navbar from "./navbar";

const RouteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Head>
        <title>Solidarity Pathways | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />{" "}
        <meta
          name="viewport"
          content="width=device-width,height=device-height initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />{" "}
        <link rel="manifest" href="/manifest.json" />{" "}
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" />  */}
      </Head>

      <main className="fixed flex h-full w-full flex-col ">
        <Navbar />
        <div className="relative flex h-full  flex-col-reverse  bg-slate-50 p-2  max-md:overflow-auto md:flex-row lg:h-[calc(100vh-64px)]">
          {children}
        </div>
      </main>
    </>
  );
};
export default RouteLayout;
