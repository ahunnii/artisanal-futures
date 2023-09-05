import * as React from "react";

interface EmailTemplateProps {
  fullName: string;
  message: string;
}

export const InquiryTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  fullName,
  message,
}) => (
  <div>
    <h1>A new membership request from: {fullName}!</h1>

    <p>{message}</p>
  </div>
);
