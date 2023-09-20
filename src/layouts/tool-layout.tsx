import Navbar from "~/components/navbar";

const ToolLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className=" flex h-full flex-grow flex-row items-stretch bg-slate-50 p-8">
        {children}
      </div>
    </main>
  );
};
export default ToolLayout;
