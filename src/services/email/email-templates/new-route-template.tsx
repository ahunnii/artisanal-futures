import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import * as React from "react";

import { env } from "~/env.mjs";

interface RoutingMagicLinkProps {
  url: string;
  loginCode?: string;
}

const baseUrl = "https://artisanalfutures.org";

export const NewRouteTemplate = ({
  url,
  loginCode = "sparo-ndigo-amurt-secan",
}: RoutingMagicLinkProps) => (
  <Html>
    <Head />
    <Preview>Access new route with magic link</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          New Route Assignment for Solidarity Pathways
        </Heading>
        {url && (
          <Link
            href={url}
            target="_blank"
            style={{
              ...link,
              display: "block",
              marginBottom: "16px",
            }}
          >
            Click here to give yourself access to the route with this magic link
          </Link>
        )}

        <Text style={{ ...text, marginBottom: "14px" }}>
          Or, copy and paste this magic code in the route page along with your
          email:
        </Text>
        <code style={code}>{loginCode}</code>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "14px",
            marginBottom: "16px",
          }}
        >
          If you weren&apos;t expecting a route assignment, you can safely
          ignore this email.
        </Text>
        <Text
          style={{
            ...text,
            color: "#ababab",
            marginTop: "12px",
            marginBottom: "38px",
          }}
        >
          Hint: Make sure to use the same email address your depot has for you.
        </Text>
        <Img
          src={`${baseUrl}/img/logo.png`}
          width="144"
          height="20"
          alt="Artisanal Futures Logo"
        />
        <Text style={footer}>
          <Link
            href="https://artisanalfutures.org"
            target="_blank"
            style={{ ...link, color: "#898989" }}
          >
            Artisanal Futures
          </Link>
          , Shop worker-owned stores, share knowledge and tech.
          <br />
          Participate in the transition to a decolonized circular economy.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default NewRouteTemplate;

const main = {
  backgroundColor: "#ffffff",
};

const container = {
  paddingLeft: "12px",
  paddingRight: "12px",
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "24px 0",
};

const footer = {
  color: "#898989",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  lineHeight: "22px",
  marginTop: "12px",
  marginBottom: "24px",
};

const code = {
  display: "inline-block",
  padding: "16px 4.5%",
  width: "90.5%",
  backgroundColor: "#f4f4f4",
  borderRadius: "5px",
  border: "1px solid #eee",
  color: "#333",
};
