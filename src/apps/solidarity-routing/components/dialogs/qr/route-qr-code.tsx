import type { FC } from "react";

import QRCode from "qrcode.react";

import { env } from "~/env.mjs";

type TRouteQrCode = { url: string };

const RouteQRCode: FC<TRouteQrCode> = ({ url }) => {
  const encodedData = encodeURIComponent(url);
  const finalizedURL = `${env.NEXT_APP_URL}/tools/routing/${encodedData}`;

  return (
    <QRCode value={finalizedURL} renderAs="svg" className="h-full w-full" />
  );
};

export default RouteQRCode;
