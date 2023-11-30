import Navbar from "~/components/navbar";

const RouteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-[calc(100vh - calc(100vh - 100%))] fixed flex w-full flex-col ">
      <Navbar />
      <div className=" h-[calc(100vh - calc(100vh - 100%))] relative flex  flex-col-reverse  bg-slate-50  p-2 max-md:overflow-auto  md:flex-row lg:h-[calc(100vh-64px)]">
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
