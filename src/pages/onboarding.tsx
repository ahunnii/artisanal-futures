import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import {
  ArrowBigLeftDashIcon,
  Group,
  LayoutGrid,
  StickyNote,
  Store,
  Trophy,
  User2,
  Users,
} from "lucide-react";
import { useState } from "react";
import Body from "~/components/body";
import Logo from "~/components/logo";
import { ShopForm } from "~/components/profile/shop-form";
import { SurveyForm } from "~/components/profile/survey-form";
import BlurImage from "~/components/ui/blur-image";
import Container from "~/components/ui/container";
import { OnboardingShopForm } from "~/features/onboarding/components/onboarding-shop-form";
import { OnboardingSurveyForm } from "~/features/onboarding/components/onboarding-survey-form";
import StepBtn from "~/features/onboarding/components/step-btn";
import OnboardingLayout from "~/layouts/onboarding-layout";
import { api } from "~/utils/api";

type Steps = "get-started" | "shop" | "survey" | "next-steps";
const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState<
    "get-started" | "shop" | "survey" | "next-steps"
  >("get-started");

  const successCallback = () => {
    setCurrentStep("survey");
  };

  const { data: store } = api.shops.getCurrentUserShop.useQuery();
  const { data: survey } = api.surveys.getCurrentUserSurvey.useQuery();
  return (
    <>
      <Head>
        <title>Onboarding | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <OnboardingLayout bodyStyle="items-center justify-center flex h-full flex-col">
        <Tabs
          className="flex h-full w-full grow flex-col lg:flex-row"
          defaultValue={"get-started"}
          value={currentStep}
          onValueChange={(e) => setCurrentStep(e as Steps)}
        >
          {" "}
          <div className="flex w-full  flex-row space-y-24 bg-slate-50   p-8 lg:w-4/12 lg:max-w-md lg:flex-col">
            <Link href="/" className="  flex items-center gap-x-2 ">
              <Logo className="w-[230.844px]" />
            </Link>
            <TabsList className="flex  w-3/4 space-y-8  bg-transparent lg:w-full lg:flex-col lg:items-start lg:justify-start lg:pt-24">
              <TabsTrigger
                value="get-started"
                className="flex w-full text-left"
              >
                {" "}
                <StepBtn
                  Icon={<User2 size={24} />}
                  title="Getting Started"
                  subtitle="Learn what Artisanal Futures is all about"
                />
              </TabsTrigger>
              <TabsTrigger value="shop" className="flex w-full text-left">
                <StepBtn
                  Icon={<Store size={24} />}
                  title="Set up your shop"
                  subtitle="Establish your presence"
                />
              </TabsTrigger>
              <TabsTrigger
                value="survey"
                className="w-full items-start text-left"
              >
                <StepBtn
                  Icon={<StickyNote size={24} />}
                  title="Tell us about your business"
                  subtitle="Help us understand what you do"
                />
              </TabsTrigger>

              <TabsTrigger
                value="next-steps"
                className="w-full items-start text-left"
              >
                <StepBtn
                  Icon={<Trophy size={24} />}
                  title="Next steps"
                  subtitle="Explore what we have to offer"
                />
              </TabsTrigger>

              <Link href="/">
                <Button className="fixed bottom-5 flex gap-3">
                  <ArrowBigLeftDashIcon />
                  Go back home
                </Button>
              </Link>
            </TabsList>
          </div>
          <div className="flex w-full  max-w-7xl flex-col items-center justify-center">
            <div className=" mx-auto  flex w-full flex-col place-content-center justify-center space-y-8  p-8 align-middle">
              <div>
                <h1 className="text-3xl font-bold">
                  {currentStep === "get-started" &&
                    "      Welcome to Artisanal Futures!"}
                  {currentStep === "shop" && "Setting up your shop"}
                  {currentStep === "survey" && "Tell us about your business"}
                  {currentStep === "next-steps" && "Next steps"}
                </h1>
                <p className="text-muted-foreground">
                  {currentStep === "get-started" &&
                    "We're glad you're here! Let's get you started."}
                  {currentStep === "shop" &&
                    "Let's set up your shop so you can start promoting."}
                  {currentStep === "survey" &&
                    "Help us understand what you do so we can better serve you."}
                  {currentStep === "next-steps" &&
                    "Now that you're all set up, let's explore what we have to offer."}
                </p>
              </div>
              <div className="h-[800px] w-full overflow-auto">
                <TabsContent value="get-started">
                  <Card>
                    <CardContent className="flex items-center gap-4 space-y-2 p-8">
                      <div className="w-2/3 space-y-3">
                        <p>
                          Thank you for joining the Artisanal Futures platform.
                          Our mission is to help worker-owned businesses, worker
                          collectives, artisanal enterprise, and other forms of
                          grass-roots economic development and civic support.
                          The “big picture” goal is to replace the extractive
                          economy of big corporations, who put the lion&apos;s
                          share in their own pockets, with a community-based
                          economy that returns value to those who generate it.
                          For businesses, the Artisanal Futures platform
                          provides collaboration tools: for example, linking
                          local supply chains such as farms and restaurants, or
                          sharing access to AI or other technologies. For the
                          public, it provides a marketplace where consumers are
                          buying locally, saving money by buying in bulk,
                          sharing knowledge, and engaging in other civic
                          activities that might improve education and
                          environments and even feed back into our business
                          participants. Thus, it is a vision for the transition
                          to a decolonized circular economy.
                        </p>{" "}
                        <p>
                          We do not charge any fees or handle any transactions.
                          Customers can search for your products or services on
                          the platform, but they will be redirected to your
                          website for making any online purchase.
                        </p>
                      </div>
                      <div className="relative aspect-[1.318] w-1/3">
                        <BlurImage src={"/diaogram.png"} alt="" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => {
                          setCurrentStep("shop");
                        }}
                      >
                        Sounds Good, Let&apos;s Go!
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="shop">
                  <OnboardingShopForm
                    initialData={store ?? null}
                    onboardingView={true}
                    successCallback={successCallback}
                  />
                </TabsContent>{" "}
                <TabsContent value="survey">
                  <OnboardingSurveyForm
                    initialData={survey ?? null}
                    onboardingView={true}
                    successCallback={() => {
                      setCurrentStep("next-steps");
                    }}
                  />
                </TabsContent>
                <TabsContent
                  value="next-steps"
                  className="flex flex-col items-center justify-center space-y-8"
                >
                  <div className="flex h-full w-full flex-1 grow flex-row items-center justify-center gap-5  ">
                    <div className=" w-1/3  ">
                      <Link href="/forum">
                        <Card className=" w-full ">
                          <CardHeader>
                            <CardTitle>Head to the Forms</CardTitle>
                            <CardDescription>
                              Introduce yourself to the community, create a
                              forum for your business, and more.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex h-fit  flex-row justify-center">
                            <Users className="h-24 w-24" />
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                    <div className=" w-1/3  ">
                      <Link href="/shops">
                        <Card className="w-full">
                          <CardHeader>
                            <CardTitle>Manage your Store</CardTitle>
                            <CardDescription>
                              Modify your store&apos;s information, add
                              products, and more.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex h-fit  flex-row justify-center">
                            <Store className="h-24 w-24" />
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                    <div className=" w-1/3  ">
                      <Link href="/tools">
                        <Card className="w-full">
                          <CardHeader>
                            <CardTitle> Check out our available apps</CardTitle>
                            <CardDescription>
                              From calculating optimal routes for deliveries to
                              playing with the power of AI, we have a lot to
                              offer.
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex h-fit  flex-row justify-center">
                            <LayoutGrid className="h-24 w-24" />
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </OnboardingLayout>
    </>
  );
};

export default OnboardingPage;