import Container from "~/components/ui/container";
import Footer from "./footer";
import Navbar from "./navbar";
const Body = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex h-screen flex-col">
      <Navbar />
      <Container className=" h-full  p-8">{children}</Container>
      <Footer />
    </main>
  );
};
export default Body;
