import { DisplayForm } from "~/apps/profile/display-form";
import { Separator } from "~/components/ui/separator";
import ProfileLayout from "~/layouts/profile-layout";

export default function ProfileDisplayPage() {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Display</h3>
          <p className="text-sm text-muted-foreground">
            Turn items on or off to control what&apos;s displayed in the app.
          </p>
        </div>
        <Separator />
        <DisplayForm />
      </div>
    </ProfileLayout>
  );
}
