/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const year = new Date().getFullYear();
  return (
    <main className="flex min-h-screen flex-col">
      <Container>
        <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="ml-4 flex gap-x-2 lg:ml-0">
            <img
              className="block h-5 w-auto lg:hidden"
              src="/img/logo.png"
              alt="Artisanal Futures logo"
            />
            <img
              className="hidden h-5 w-auto lg:block"
              src="/img/logo.png"
              alt="Artisanal Futures logo"
            />
          </Link>
        </div>
      </Container>
      <Container className=" flex h-full flex-grow flex-col items-stretch p-8">
        {children}
      </Container>
      <Container>
        <footer className="mt-16 ">
          <div className="mx-auto py-10">
            <p className=" text-sm text-black">
              &copy; {year} Artisanal Futures. All rights reserved.
            </p>
          </div>
        </div>
        <div className="relative mx-auto flex  h-full  w-full max-w-7xl  flex-col-reverse p-2 px-4 max-md:overflow-auto md:flex-row lg:h-[calc(100vh-64px)]">
          {children}
        </div>
        <footer className=" mx-auto w-full max-w-7xl px-4 py-10 max-md:text-center">
          <p className=" text-sm text-black">
            &copy; {year} Artisanal Futures. All rights reserved.
          </p>
        </footer>{" "}
      </main>
    </>
  );
};
export default AuthLayout;
