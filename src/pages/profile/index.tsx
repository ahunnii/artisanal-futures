import { ProfileForm } from "~/components/profile/profile-form";
import { Separator } from "~/components/ui/separator";
import ProfileLayout from "~/layouts/profile-layout";

export default function ProfilePage() {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile</h3>
          <p className="text-sm text-muted-foreground">
            This is how others will see you on the site.
          </p>
        </div>
        <Separator />
        <ProfileForm />
      </div>
    </ProfileLayout>
  );
}
