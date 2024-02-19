import { cn } from "~/utils/styles";

const OnboardingLayout = ({
  children,
  bodyStyle = "",
  mainStyle = "",
}: {
  children: React.ReactNode;
  bodyStyle?: string;
  mainStyle?: string;
  navStyles?: string;
}) => {
  return (
    <>
      <main className={cn("flex h-full  min-h-screen flex-row", mainStyle)}>
        {" "}
        <div className="flex h-full  min-h-screen w-full flex-col">
          {/* <Container>
            <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
              <Link href="/" className="ml-4 flex gap-x-2 lg:ml-0">
                <img
                  className="block h-5 w-auto lg:hidden"
                  src="/img/logo.png"
                  alt="Artisanal Futures logo"
                />
                <img
                  className="hidden h-5 w-auto lg:block"
                  src="/img/logo.png"
                  alt="Artisanal Futures logo"
                />
              </Link>
            </div>
          </Container> */}
          <div
            className={cn("mx-auto  h-full w-full   flex-grow  ", bodyStyle)}
          >
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default OnboardingLayout;
