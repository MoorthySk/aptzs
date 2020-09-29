import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { XCircle } from "react-feather";
import { quaterlySales, quaterlySalesSeries } from "./StatisticsData";

class QuaterlySales extends React.Component {
  render() {
    return (
      <StatisticsCard
        icon={<XCircle className="danger" size={22} />}
        iconBg="danger"
        stat="12"
        statTitle="UnListed"
        options={quaterlySales}
        series={quaterlySalesSeries}
        type="area"
      />
    );
  }
}
export default QuaterlySales;
