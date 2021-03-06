import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Row,
  Col,
} from "reactstrap";
import Chart from "react-apexcharts";
import { ChevronDown } from "react-feather";
import axios from "axios";
class SupportTracker extends React.Component {
  state = {
    options: {
      chart: {},
      plotOptions: {
        radialBar: {
          size: 150,
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: "65%",
          },
          track: {
            background: this.props.white,
            strokeWidth: "100%",
          },
          dataLabels: {
            value: {
              offsetY: 30,
              color: "#99a2ac",
              fontSize: "2rem",
            },
          },
        },
      },
      colors: [this.props.danger],
      fill: {
        type: "gradient",
        gradient: {
          // enabled: true,
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: [this.props.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        dashArray: 8,
      },
      labels: ["Completed Tickets"],
    },
    series: [],
  };
  async componentDidMount() {
    await axios
      .post("/maint/task/task-status/")
      .then((response) => {
        let rowData = response.data.taskStatus;
        this.state.series = [response.data.taskStatus.percentage];
        console.log("series " + this.state.series);
        this.setState({
          completedTask: rowData.completedTask,
          newTask: rowData.newTask,
          opendTask: rowData.opendTask,
          percentage: rowData.percentage,
          resCount: rowData.resCount,
          taskName: rowData.taskName,
          totalTask: rowData.totalTask,
        });
      })
      .catch((error) => {
        console.log("error:::" + error);
      });
  }
  render() {
    const {
      completedTask = "",
      newTask = "",
      opendTask = "",
      percentage = "",
      resCount = "",
      totalTask = "",
    } = this.state;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Status</CardTitle>
          <UncontrolledDropdown>
            <DropdownToggle className="cursor-pointer" tag="small">
              Last 7 days <ChevronDown size={10} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>Last 28 days</DropdownItem>
              <DropdownItem>Last Month</DropdownItem>
              <DropdownItem>Last Year</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </CardHeader>
        <CardBody className="pt-0">
          <Row>
            <Col sm="2" className="d-flex flex-column flex-wrap text-center">
              <h1 className="font-large-2 text-bold-600 mt-2 mb-0">
                {totalTask}
              </h1>
              <small>Task</small>
            </Col>
            <Col sm="10" className="d-flex justify-content-center">
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="radialBar"
                height={350}
                className="support-tracker-card"
              />
            </Col>
          </Row>
          <div className="chart-info d-flex justify-content-between">
            <div className="text-center">
              <p className="mb-50">New Tasks</p>
              <span className="font-large-1">{newTask}</span>
            </div>
            <div className="text-center">
              <p className="mb-50">Open Tasks</p>
              <span className="font-large-1">{opendTask}</span>
            </div>
            <div className="text-center">
              <p className="mb-50">Completed Tasks</p>
              <span className="font-large-1">{completedTask}</span>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }
}
export default SupportTracker;
