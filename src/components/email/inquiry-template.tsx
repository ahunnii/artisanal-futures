import * as React from "react";

interface EmailTemplateProps {
  fullName: string;
  message: string;
  email: string;
}

export const InquiryTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  fullName,
  message,
  email,
}) => (
  <div>
    <h1>A new membership request from: {fullName}!</h1>

    <p>{message}</p>

    <p>Get in touch at their email: {email}</p>
  </div>
);
