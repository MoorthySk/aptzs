import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { Build } from "@material-ui/icons";
import { revenueGeneratedSeries, revenueGenerated } from "./StatisticsData";

class RevenueGenerated extends React.Component {
  render() {
    return (
      <StatisticsCard
        icon={<Build className="success" size={22} />}
        iconBg="success"
        stat="145"
        statTitle="Total Task - Oct"
        options={revenueGenerated}
        series={revenueGeneratedSeries}
        type="area"
      />
    );
  }
}
export default RevenueGenerated;
