import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import SiteLayout from "~/layouts/site-layout";

const UnauthorizedPage = () => {
  return (
    <>
      <Head>
        <title>Unauthorized</title>
        <meta name="description" content="Admin" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SiteLayout bodyStyle="items-center justify-center flex">
        <div className="flex flex-col items-center">
          <Image
            src="/img/lost.svg"
            width={500}
            height={500}
            alt="Unauthorized"
          />
          <h1 className="mt-5 text-7xl font-bold">Unauthorized</h1>
          <h2 className="text-xl text-muted-foreground">
            Oh no, it looks like you don&apos;t have access to this page.
          </h2>

          <div className="mt-5 flex justify-around gap-4">
            <Link href="/">
              <Button>Head back to home</Button>
            </Link>
          </div>
        </div>
      </SiteLayout>
    </>
  );
};

export default UnauthorizedPage;
