import * as React from "react";

interface EmailTemplateProps {
  message: string;
}

export const RouteTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  message,
}) => (
  <div>
    <h1>A new route has been assigned to you by Artisanal Futures Depot!</h1>

    <br />
    <p>{message}</p>
  </div>
);
