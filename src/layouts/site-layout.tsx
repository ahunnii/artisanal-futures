import Footer from "~/components/footer";
import Navbar from "~/components/navbar";
import { SeoMetadataHead } from "~/components/seo-metadata-head";

import { cn } from "~/utils/styles";

const SiteLayout = ({
  children,
  bodyStyle = "",
  mainStyle = "",
  title = "Artisanal Futures",
  description = "Shop worker-owned stores, share knowledge and tech, & participate in the transition to a decolonized circular economy.",
}: {
  children: React.ReactNode;
  bodyStyle?: string;
  mainStyle?: string;
  navStyles?: string;
  title?: string;
  description?: string;
}) => {
  return (
    <>
      <SeoMetadataHead title={title} description={description} />

      <main className={cn("flex h-full  min-h-screen flex-col", mainStyle)}>
        <Navbar />

        <div
          className={cn(
            "mx-auto  h-full w-full max-w-7xl flex-grow pb-10 pt-16",
            bodyStyle
          )}
        >
          {children}
        </div>

        <Footer />
      </main>
    </>
  );
};

export default SiteLayout;
