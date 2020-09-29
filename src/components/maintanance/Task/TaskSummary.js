import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import WorkOrder from "../summary/WorkOrder";
import WorkOrderCreate from "../summary/WorkOrderCreate";
import Summary from "../summary/Summary";
import { Subject, CreditCard, Assignment } from "@material-ui/icons";
import axios from "axios";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  CardBody,
  ListGroup,
  ListGroupItem,
  Card,
  CardHeader,
  CardTitle,
  FormGroup,
  Button,
} from "reactstrap";

import classnames from "classnames";
class MaintananceSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskId: this.props.match.params.taskId,
      activeTab: "1",
      active: "1",
      wororderUpdate: "1",
    };
  }

  toggleTab = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };
  toggle = (tab) => {
    if (this.state.active !== tab) {
      this.setState({ active: tab });
    }
  };
  handleCancel = () => {
    this.props.history.push("/rentalsSearch");
  };
  componentDidMount() {
    console.log("task id   " + this.state.taskId);
    var taskId = this.props.match.params.taskId;
    let mess = "";

    axios
      .post("/maint/workorder/check-available/", {
        maintId: taskId,
      })
      .then((response1) => {
        //console.log("response:"+response1.data.isUpdate);
        mess = response1.data.isUpdate;
        //console.log("update:"+mess);
        this.setState({
          wororderUpdate: mess,
        });
      });
  }
  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state;
    return (
      <Formik>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Nav tabs className="nav-justified">
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.active === "1",
                  })}
                  onClick={() => {
                    this.toggle("1");
                  }}
                >
                  <h6>
                    <Subject />
                    Summary
                  </h6>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.active === "2",
                  })}
                  onClick={() => {
                    this.toggle("2");
                  }}
                >
                  <h6>
                    <CreditCard />
                    Work Order
                  </h6>
                </NavLink>
              </NavItem>
            </Nav>
            <Col sm="12">
              <TabContent className="py-50" activeTab={this.state.active}>
                <TabPane tabId="1">
                  <Row>
                    <Col md="12" sm="12">
                      <Summary taskId={this.state.taskId} />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Col md="12" sm="12">
                    {(() => {
                      switch (this.state.wororderUpdate) {
                        case "1":
                          return <WorkOrderCreate taskId={this.state.taskId} />;
                        case "0":
                          return <WorkOrder taskId={this.state.taskId} />;
                        default:
                          return <WorkOrder taskId={this.state.taskId} />;
                      }
                    })()}
                  </Col>
                </TabPane>
              </TabContent>
            </Col>
          </TabPane>
        </TabContent>
      </Formik>
    );
  }
}
export default MaintananceSummary;
