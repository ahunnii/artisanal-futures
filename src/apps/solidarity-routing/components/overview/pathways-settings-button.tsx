import { Button } from "~/components/ui/button";

import { Settings } from "lucide-react";
import { PathwaysSettingsMenu } from "~/apps/solidarity-routing/components/settings/pathways-settings-menu.wip";

export const PathwaySettingsButton = () => {
  return (
    <PathwaysSettingsMenu>
      <Button className="mx-0 flex gap-2 px-0 " variant={"link"}>
        <Settings />
        Settings
      </Button>
    </PathwaysSettingsMenu>
  );
};
