import { useSession } from "next-auth/react";
import Container from "~/components/ui/container";
import Footer from "./footer";
import Navbar from "./navbar";
import PageLoader from "./ui/page-loader";

const Body = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  return (
    <main className="flex min-h-screen flex-col">
      {!session && <PageLoader />}
      {session && (
        <>
          <Navbar />
          <Container className=" flex h-full flex-grow flex-col items-stretch p-8">
            {children}
          </Container>
          <Footer />
        </>
      )}
    </main>
  );
};
export default Body;
