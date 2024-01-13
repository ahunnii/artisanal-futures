import Footer from "~/components/footer";
import Navbar from "~/components/navbar";

import { cn } from "~/utils/styles";

const SiteLayout = ({
  children,
  bodyStyle = "",
  mainStyle = "",
}: {
  children: React.ReactNode;
  bodyStyle?: string;
  mainStyle?: string;
  navStyles?: string;
}) => {
  return (
    <>
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
