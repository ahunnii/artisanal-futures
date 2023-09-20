/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Container from "~/components/ui/container";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
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
              &copy; 2023 Artisanal Futures. All rights reserved.
            </p>
          </div>
        </footer>{" "}
      </Container>
    </main>
  );
};
export default AuthLayout;
