import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import SiteLayout from "~/layouts/site-layout";

const UnauthorizedPage = () => {
  const router = useRouter();

  const navigateToShop = () => {
    router.replace("/collections/all-products");
  };
  const askQuestion = () => {
    router.replace("/contact-us");
  };

  return (
    <>
      <Head>
        <title>Homepage | Store Co.</title>
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
            <Button onClick={navigateToShop}>Head back to the shop</Button>
          </div>
        </div>
      </SiteLayout>
    </>
  );
};

export default UnauthorizedPage;
