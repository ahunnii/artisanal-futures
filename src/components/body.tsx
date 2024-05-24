import Container from "~/components/ui/container";
import CookieConsent from "./cookie-banner";
import Footer from "./footer";
import Navbar from "./navbar";
import { SeoMetadataHead } from "./seo-metadata-head";

const Body = ({
  children,
  title = "Artisanal Futures",
  description = "Shop worker-owned stores, share knowledge and tech, & participate in the transition to a decolonized circular economy.",
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) => {
  return (
    <>
      <SeoMetadataHead title={title} description={description} />
      <main className="flex min-h-screen flex-col">
        <>
          <Navbar />
          <Container className=" flex h-full flex-grow flex-col items-stretch p-8">
            {children}
          </Container>
          <Footer />
        </>
      </main>
      <CookieConsent />
    </>
  );
};
export default Body;
