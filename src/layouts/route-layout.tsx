import Navbar from "~/components/navbar";

const RouteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="fixed flex h-screen w-full flex-col ">
      <Navbar />
      <div
        className="  relative flex  h-[calc(100vh-164px)]  flex-col-reverse  bg-slate-50  p-2 max-md:overflow-auto  md:flex-row lg:h-[calc(100vh-64px)]
      "
      >
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
