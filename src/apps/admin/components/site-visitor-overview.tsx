import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import * as Card from "~/components/ui/card";
import { cn } from "~/utils/styles";
import { SITE_VISITOR_MOCK } from "../data/site-visitor-mock";

export function SiteVisitorOverview({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card.Card className={cn("col-span-4", className)}>
      <Card.CardHeader>
        <Card.CardTitle>Unique Site Visitors</Card.CardTitle>
        <Card.CardDescription>
          This is mock data. Actual visitors are not reflected here.
        </Card.CardDescription>
      </Card.CardHeader>
      <Card.CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={SITE_VISITOR_MOCK}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card.CardContent>
    </Card.Card>
  );
}
