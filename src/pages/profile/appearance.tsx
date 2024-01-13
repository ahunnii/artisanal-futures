import { AppearanceForm } from "~/apps/profile/appearance-form";
import { Separator } from "~/components/ui/separator";
import ProfileLayout from "~/layouts/profile-layout";

export default function ProfileAppearancePage() {
  return (
    <ProfileLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Appearance</h3>
          <p className="text-sm text-muted-foreground">
            Customize the appearance of the app. Automatically switch between
            day and night themes.
          </p>
        </div>
        <Separator />
        <AppearanceForm />
      </div>
    </ProfileLayout>
  );
}
