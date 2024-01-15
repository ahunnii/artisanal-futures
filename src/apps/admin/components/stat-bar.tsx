import type { AdminStat } from "../types";
import AdminInfoCard from "./admin-info-card";

const StatBar = ({ stats }: { stats: AdminStat[] }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((item, idx) => (
        <AdminInfoCard {...item} key={idx} />
      ))}
    </div>
  );
};

export default StatBar;
