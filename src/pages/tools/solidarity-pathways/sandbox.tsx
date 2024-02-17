import RouteLayout from "~/apps/solidarity-routing/components/layout/route-layout";

const SandboxRoutingPage = () => {
  return (
    <>
      <RouteLayout>
        <div className="flex flex-1 flex-col items-center justify-center">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
            {" "}
            Solidarity Pathways Sandbox
          </h1>
          <p className="text-center leading-7 [&:not(:first-child)]:mt-6">
            A way to generate optimal routes for your delivery needs. Check back
            later for more details.
          </p>
        </div>
      </RouteLayout>
    </>
  );
};

export default SandboxRoutingPage;
