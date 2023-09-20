import * as React from "react";

interface EmailTemplateProps {
  message: string;
}

export const RouteTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  message,
}) => (
  <div>
    <h1>A new route listing is now available!</h1>

    <p>{message}</p>
  </div>
);
