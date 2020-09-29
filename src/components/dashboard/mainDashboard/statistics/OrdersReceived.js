import React from "react";
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard";
import { CheckCircle } from "react-feather";
import { ordersReceived, ordersReceivedSeries } from "./StatisticsData";

class OrdersReceived extends React.Component {
  render() {
    return (
      <StatisticsCard
        icon={<CheckCircle className="warning" size={22} />}
        iconBg="warning"
        stat="15"
        statTitle="Listed"
        options={ordersReceived}
        series={ordersReceivedSeries}
        type="area"
      />
    );
  }
}
export default OrdersReceived;
