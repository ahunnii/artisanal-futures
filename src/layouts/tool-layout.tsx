import Navbar from "~/components/navbar";

const ToolLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex  h-screen flex-col  ">
      <Navbar />
      <div className=" flex max-h-[calc(100vh-64px)] flex-grow flex-row items-stretch bg-slate-50 p-8">
        {children}
      </div>
    </main>
  );
};
export default ToolLayout;
