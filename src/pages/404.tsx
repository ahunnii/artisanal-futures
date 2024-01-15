import Head from "next/head";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import SiteLayout from "~/layouts/site-layout";

const ErrorPage = () => {
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
          <h1 className="text-9xl font-bold">404</h1>
          <h2 className="text-xl text-muted-foreground">
            Oh no, it looks like that page doesn&apos;t exist - please check the
            URL and try again.
          </h2>

          <div className="mt-5 flex justify-around gap-4">
            <Button onClick={navigateToShop}>Head back to the shop</Button>

            <Button onClick={askQuestion}>Ask us a question</Button>
          </div>
        </div>
      </SiteLayout>
    </>
  );
};

export default ErrorPage;
