import { NotificationsForm } from "~/components/profile/notifications-form";
import { Separator } from "~/components/ui/separator";
import ProfileLayout from "~/layouts/profile-layout";

export default function ProfileNotificationsPage() {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Configure how you receive notifications.
          </p>
        </div>
        <Separator />
        <NotificationsForm />
      </div>
    </ProfileLayout>
  );
}
