import { serialize } from "cookie";

import { generatePassCode } from "../generic/generate-passcode";

export const generateDriverPassCode = (props: {
  pathId: string;
  depotCode: string;
  email: string;
}) => {
  return generatePassCode(`${props.pathId}${props.depotCode}${props.email}`);
};

export const verifyDriverPassCode = (props: {
  passcode: string;
  pathId: string;
  depotCode: string;
  email: string;
}) => {
  return (
    generateDriverPassCode({
      pathId: props.pathId,
      depotCode: props.depotCode,
      email: props.email,
    }) === props.passcode
  );
};

export const createDriverVerificationCookie = (props: {
  passcode: string;
  minuteDuration: number;
}) => {
  const expiresAt = 60 * 1000 * props.minuteDuration;
  const cookie = serialize("verifiedDriver", props.passcode, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + expiresAt),
  });

  return cookie;
};
