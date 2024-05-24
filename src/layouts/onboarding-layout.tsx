/* eslint-disable react-hooks/exhaustive-deps */

import Link from "next/link";
import { useEffect } from "react";
import StepBtn from "~/apps/onboarding/components/step-btn";

import Logo from "~/components/logo";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import {
  ArrowBigLeftDashIcon,
  LayoutGrid,
  StickyNote,
  Store,
  Trophy,
  User2,
  Users,
} from "lucide-react";

// import { MainNav } from "~/modules/navigation/admin/main-nav";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { api } from "~/utils/api";

interface IProps {
  children: React.ReactNode;
  metadata?: {
    title: string;
    description: string;
  };
}
const OnboardingLayout = ({ children, metadata }: IProps) => {
  return (
    <>
      <div className="ignore-default h-svh fixed grid w-full overflow-hidden  bg-slate-100/50 lg:grid-cols-[280px_1fr]">
        <div className="fixed inset-0 z-10 hidden h-full translate-x-0 transform overflow-auto border-r bg-gray-100/40 transition-transform duration-200 ease-in-out dark:bg-gray-800/40 lg:static lg:z-auto lg:block lg:translate-x-0">
          <div className="max-h-svh flex h-full flex-col gap-2">
            <div className="flex h-[60px] items-center border-b bg-background/75 px-6">
              <Link href="/" className="  flex items-center gap-x-2 ">
                <Logo className="w-[230.844px]" />
              </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <TabsList className="flex  w-full justify-end space-y-8  bg-transparent  lg:w-full lg:flex-col lg:items-start lg:justify-start lg:pt-24">
                <MobileOnboardingNavigation />

                <>
                  <TabsTrigger
                    value="get-started"
                    className="flex w-full text-left max-lg:hidden"
                  >
                    {" "}
                    <StepBtn
                      Icon={<User2 size={24} />}
                      title="Getting Started"
                      subtitle="Learn what Artisanal Futures is all about"
                    />
                  </TabsTrigger>
                  <TabsTrigger
                    value="shop"
                    className="flex w-full text-left max-lg:hidden"
                  >
                    <StepBtn
                      Icon={<Store size={24} />}
                      title="Set up your shop"
                      subtitle="Establish your presence"
                    />
                  </TabsTrigger>
                  <TabsTrigger
                    value="survey"
                    className="w-full items-start text-left max-lg:hidden"
                  >
                    <StepBtn
                      Icon={<StickyNote size={24} />}
                      title="Tell us about your business"
                      subtitle="Help us understand what you do"
                    />
                  </TabsTrigger>

                  <TabsTrigger
                    value="next-steps"
                    className="w-full items-start text-left max-lg:hidden"
                  >
                    <StepBtn
                      Icon={<Trophy size={24} />}
                      title="Next steps"
                      subtitle="Explore what we have to offer"
                    />
                  </TabsTrigger>
                </>

                <Link href="/" className="max-lg:hidden">
                  <Button className="fixed bottom-5 flex gap-3">
                    <ArrowBigLeftDashIcon />
                    Go back home
                  </Button>
                </Link>
              </TabsList>
            </div>
            <div className="mt-auto p-4">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Need Some Help?</CardTitle>
                  <CardDescription>
                    Check out your site documentation below or email us.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    prefetch={false}
                    href="https://artisan-ecommerce-docs.vercel.app"
                  >
                    <Button className="w-full">View Docs</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <main className="h-svh flex flex-col overflow-y-auto">
          <div className="sticky top-0 z-20 flex items-center gap-4 bg-white ">
            {/* <Navbar stores={getAllStores.data ?? []} /> */}
            <h1 className="text-3xl font-bold">Admin Layout</h1>
          </div>
          <div className="flex h-full flex-col bg-gray-50/25 dark:bg-slate-900">
            <div className="relative flex-1">{children}</div>
          </div>
          {/* <ScrollArea className="h-[calc(100vh-70px)] "></ScrollArea> */}
          {/* <>{children}</> */}
        </main>
      </div>
    </>
  );
};

const MobileOnboardingNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger className="hidden max-lg:flex">
        <HamburgerMenuIcon />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Artisanal Futures Onboarding</SheetTitle>
          <SheetDescription>
            If you are unable to finish up now, no worries! You can always
            complete the setup later in your account.
          </SheetDescription>

          <div className="w-full space-y-4">
            <TabsTrigger value="get-started" className="flex w-full text-left ">
              {" "}
              <StepBtn
                Icon={<User2 size={24} />}
                title="Getting Started"
                subtitle="Learn what Artisanal Futures is all about"
              />
            </TabsTrigger>
            <TabsTrigger value="shop" className="flex w-full text-left ">
              <StepBtn
                Icon={<Store size={24} />}
                title="Set up your shop"
                subtitle="Establish your presence"
              />
            </TabsTrigger>
            <TabsTrigger
              value="survey"
              className="w-full items-start text-left "
            >
              <StepBtn
                Icon={<StickyNote size={24} />}
                title="Tell us about your business"
                subtitle="Help us understand what you do"
              />
            </TabsTrigger>

            <TabsTrigger
              value="next-steps"
              className="w-full items-start text-left "
            >
              <StepBtn
                Icon={<Trophy size={24} />}
                title="Next steps"
                subtitle="Explore what we have to offer"
              />
            </TabsTrigger>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default OnboardingLayout;
