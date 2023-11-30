import Navbar from "~/components/navbar";

const RouteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="fixed flex h-full w-full flex-col ">
      <Navbar />
      <div className="relative flex h-full  flex-col-reverse  bg-slate-50 p-2  max-md:overflow-auto md:flex-row lg:h-[calc(100vh-64px)]">
        {children}
      </div>

      <p className="mt-auto">Artisanal Futures 2023</p>
    </main>

    // <main className="flex h-full flex-col">
    //   <Navbar />
    //   <div className="relative flex min-h-0 flex-1">{children}</div>
    // </main>
  );
};
export default RouteLayout;
