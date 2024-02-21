import Head from "next/head";
import { useRouter } from "next/router";

import { env } from "~/env.mjs";

// import defaultImage from "~/assets/images/default.jpg";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
}

// const pageImage = env.NEXT_PUBLIC_URL + defaultImage.src.slice(1);

// import favicon16 from "~/shop/core/assets/favicons/favicon-16x16.png";
// import favicon32 from "~/shop/core/assets/favicons/favicon-32x32.png";
// import faviconIco from "~/shop/core/assets/favicons/favicon.ico";

const ROOT_URL = env.NEXT_PUBLIC_APP_URL;

export const SeoMetadataHead = ({
  title,
  description,
  image = "",
  type = "website",
}: SEOProps) => {
  const router = useRouter();
  const url = `${ROOT_URL}/${router.asPath}`;

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />

      <link rel="manifest" href="/manifest.json" />

      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />

      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
      <meta
        name="viewport"
        content="width=device-width,height=device-height initial-scale=1"
      />
      <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
      <meta name="description" content={description} />
      <meta name="robots" content="follow, index" />

      {/* <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@JeffreySunny1" />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} /> */}
      {/* 
      <meta property="og:site_name" content="Artisanal Futures" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} /> */}

      {/* <link rel="mask-icon" href="" color="#5bbad5" /> Add mask icon */}
      {/* <meta name="msapplication-TileColor" content="#da532c" /> */}
      {/* <meta name="theme-color" content="#ffffff" /> */}

      {/* <link rel="canonical" href={url} /> */}
    </Head>
  );
};
