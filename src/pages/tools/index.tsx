import Head from "next/head";

import Body from "~/components/body";
import ToolCard from "~/components/tools/tool-card";

export default function ToolsPage() {
  return (
    <>
      <Head>
        <title>Tools | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Body>
        <h1 className="text-5xl font-semibold">Utilize Our Tools</h1>
        <p className="lead mb-3 mt-2 text-2xl text-slate-400">
          Browse our current selection of free and open source tools to power up
          your business workflow
        </p>
        <div className="flex h-fit w-full flex-col md:flex-row md:flex-wrap">
          <div className="mx-auto flex basis-full p-4 md:basis-1/2 lg:basis-1/4 ">
            <ToolCard
              title="Shop Rate"
              subtitle="Calculates per hour cost of your shop"
              type="Finance"
              image="img/shop_rate.png"
              url={"/tools/shop-rate-calculator"}
            />{" "}
          </div>
          <div className="mx-auto flex basis-full p-4 md:basis-1/2 lg:basis-1/4 ">
            {" "}
            <ToolCard
              title="Optimize Routing"
              subtitle="Optimize your delivery route"
              type="Logistics"
              image="img/route_optimization.png"
              url={"/tools/routing"}
              // url={"https://af-routing-app.vercel.app/"}
            />{" "}
          </div>
          <div className="mx-auto flex basis-full p-4 md:basis-1/2 lg:basis-1/4 ">
            <ToolCard
              title="Craft Recomposition"
              subtitle="Break down an image into its bill of materials"
              type="Logistics"
              image="img/craft_composition.png"
              url={"/tools/craft-recomposition"}
            />{" "}
          </div>
          <div className="mx-auto flex basis-full p-4 md:basis-1/2 lg:basis-1/4 ">
            <ToolCard
              title="AI for Cloth"
              subtitle="Generate cloth patterns using AI"
              type="Design"
              image="img/ai_cloth.png"
              url={"/tools/pattern-generator"}
            />
          </div>
        </div>
      </Body>
    </>
  );
}