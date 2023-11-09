import Container from "~/components/ui/container";
import Footer from "./footer";
import Navbar from "./navbar";

const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="flex min-h-screen flex-col">
        <>
          <Navbar />
          <Container className=" flex h-full flex-grow flex-col items-stretch p-8">
            {children}
          </Container>
          <Footer />
        </>
      </main>
    </>
  );
};
export default Body;
