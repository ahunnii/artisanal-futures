import { Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const AdminInfoCard = ({
  title,
  metric,
}: {
  title: string;
  metric: number;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title ?? ""}</CardTitle>
        <Eye className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{metric ?? 0}</div>
      </CardContent>
    </Card>
  );
};

export default AdminInfoCard;
