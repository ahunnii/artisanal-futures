import Navbar from "~/components/navbar";

const RouteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex  h-screen flex-col  ">
      <Navbar />
      <div className="flex max-h-[calc(100vh-64px)] w-full flex-grow items-stretch p-8">
        {children}
      </div>
    </main>
  );
};
export default RouteLayout;
