import { EmailService } from "./factory";
import { availableServices } from "./processors/available";

const selectedService =
  availableServices["resend" as keyof typeof availableServices];

export const emailService = new EmailService<typeof selectedService.client>(
  selectedService
);
