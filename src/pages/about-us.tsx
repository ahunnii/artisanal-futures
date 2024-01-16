import Head from "next/head";
import Link from "next/link";
import Body from "~/components/body";

const AboutUsPage = () => {
  return (
    <>
      <Head>
        <title>About Us | Artisanal Futures </title>
        <meta
          name="description"
          content="Artisanal Futures is a platform for worker-owned businesses, worker collectives, artisanal enterprise, and other forms of grass-roots economic development and civic support."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Body>
        <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          {" "}
          Welcome to Artisanal Futures!{" "}
        </h1>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Thank you for joining the Artisanal Futures platform. Our mission is
          to help worker-owned businesses, worker collectives, artisanal
          enterprise, and other forms of grass-roots economic development and
          civic support. The “big picture” goal is to replace the extractive
          economy of big corporations, who put the lion’s share in their own
          pockets, with a community-based economy that returns value to those
          who generate it. For businesses, the Artisanal Futures platform
          provides collaboration tools: for example, linking local supply chains
          such as farms and restaurants, or sharing access to AI or other
          technologies. For the public, it provides a marketplace where
          consumers are buying locally, saving money by buying in bulk, sharing
          knowledge, and engaging in other civic activities that might improve
          education and environments and even feed back into our business
          participants. Thus, it is a vision for the transition to a decolonized
          circular economy.
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          We do not charge any fees or handle any transactions. Customers can
          search for your products or services on the platform, but they will be
          redirected to your website for making any online purchase.
        </p>
        <h2 className="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">
          Getting started
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          To be part of the Artisanal Futures Platform, you first must get a
          code from either us, or an existing artisan. Once you got that, go
          ahead and{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary underline underline-offset-4"
          >
            sign up
          </Link>
          .
        </p>

        <ol className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            Upon signing up with your valid email address, you will be directed
            to an onboarding page where you fill in details about your business.
          </li>
          <li>
            Once you set up your shop and your survey is complete, you will be
            set up on the platform. Note you do need to do both in order to get
            featured. If you are unable to do so at that time, you can always
            continue in your profile.
          </li>
          <li>
            You are encouraged to participate in the community forum and
            interact with the platform browsers through other artisans&apos;
            product offerings.
          </li>
        </ol>

        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight ">
          Disclaimer
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          The Artisanal Futures platform encourages a collaborative and creative
          environment. While we strive to provide a positive experience, we must
          emphasize that:
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            Artisans are responsible for the content they upload regarding their
            businesses.
          </li>
          <li>Please respect copyright and intellectual property rights.</li>
          <li>
            Any disputes should be resolved amicably within the community.
          </li>
        </ul>

        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          User Agreement
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          You agree to abide by our{" "}
          <Link
            href="/legal/privacy"
            className="font-medium text-primary underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          ,{" "}
          <Link
            href="/legal/collective-agreement"
            className="font-medium text-primary underline underline-offset-4"
          >
            The Artisanal Futures Collective Agreement
          </Link>
          , and{" "}
          <Link
            href="/legal/terms-of-use"
            className="font-medium text-primary underline underline-offset-4"
          >
            Terms of Use.
          </Link>{" "}
          Please review them carefully.
        </p>

        <h2 className="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">
          Support
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Questions? Reach out to our Support Team for assistance.
          {/* on the{" "} <Link
            href="/contact-us"
            className="font-medium text-primary underline underline-offset-4"
          >
            Contact Us
          </Link>{" "} */}
          {/* page.{" "} */}
        </p>
      </Body>
    </>
  );
};
export default AboutUsPage;
