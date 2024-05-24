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
        <div className={cn("mx-auto h-full w-full flex-grow", bodyStyle)}>
          {children}
        </div>
      </main>
    </>
  );
};

export default OnboardingLayout;
