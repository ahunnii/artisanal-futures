import Head from "next/head";
import Body from "~/components/body";

const PolicyInformationPage = () => {
  return (
    <>
      {" "}
      <Head>
        <title>Profile | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Body>
        {" "}
        <h1 className="text-5xl font-semibold">Legal</h1>
        <p className="lead mb-3 mt-2 text-2xl text-slate-400">
          Policies for our community and other legal stuff
        </p>
        <ul className="my-5 list-inside list-disc space-y-4   text-blue-500">
          <li className="transition-all hover:text-blue-600 hover:underline ">
            <a href={`/legal/terms-of-use}`}>Terms of Use</a>
          </li>
          <li className="transition-all hover:text-blue-600 hover:underline ">
            <a href={`/legal/privacy}`}>Privacy</a>
          </li>{" "}
          <li className="transition-all hover:text-blue-600 hover:underline ">
            <a href={`/legal/collective-agreement}`}>
              Artisanal Futures Collective Agreement
            </a>
          </li>{" "}
          <li className="transition-all hover:text-blue-600 hover:underline ">
            <a href={`/legal/help-center}`}>Help Center</a>
          </li>
        </ul>
      </Body>
    </>
  );
};

export default PolicyInformationPage;