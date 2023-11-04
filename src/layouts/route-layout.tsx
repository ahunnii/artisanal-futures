import Navbar from "~/components/navbar";

const RouteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="fixed flex h-screen w-full flex-col  ">
      <Navbar />
      <div className="md:p-08 relative flex  h-[calc(100vh-64px)]   flex-col-reverse bg-slate-50 p-2 md:flex-row">
        {children}
      </div>
    </main>

    // <main className="flex h-full flex-col">
    //   <Navbar />
    //   <div className="relative flex min-h-0 flex-1">{children}</div>
    // </main>
  );
};
export default RouteLayout;
