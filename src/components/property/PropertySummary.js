import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import Summary from "./summary/Summary";
import UnitsStatus from "./summary/UnitsStatus";
import { XSquare } from "react-feather";
import TaskStatus from "./summary/TaskStatus";
import { Spinner } from "reactstrap";
import {
  Subject,
  CreditCard,
  Assignment,
  HomeWork,
  Event,
} from "@material-ui/icons";

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
class PropertySummary extends React.Component {
  state = {
    activeTab: "1",
    active: "1",
    propertyId: this.props.match.params.propertyId,
  };

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
    this.props.history.push("/propertySearch");
  };

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
                  {" "}
                  <Subject color="primary" />
                  <span className="ml-50">Summary</span>
                  <br />
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
                  <HomeWork color="primary" />{" "}
                  <span className="ml-50">Units</span> <br />
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.active === "3",
                  })}
                  onClick={() => {
                    this.toggle("3");
                  }}
                >
                  <Assignment color="primary" />{" "}
                  <span className="ml-50">Event History</span> <br />
                </NavLink>
              </NavItem>
            </Nav>
            <Col sm="12">
              <TabContent className="py-50" activeTab={this.state.active}>
                <TabPane tabId="1">
                  <Row>
                    <Col md="12" sm="12">
                      <Summary propertyId={this.state.propertyId} />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col md="12" sm="12">
                      <UnitsStatus propertyId={this.state.propertyId} />
                    </Col>
                  </Row>
                </TabPane>

                <TabPane tabId="3">Comming soon</TabPane>
              </TabContent>
            </Col>
          </TabPane>
          <FormGroup row>
            <Col md={{ size: 8, offset: 4 }}>
              <Button.Ripple
                color="danger"
                onClick={this.handleCancel}
                className="mr-1 mb-1"
              >
                <XSquare size={14} />

                <span className="align-middle ml-25">Back</span>
              </Button.Ripple>

              {this.state.alert}
            </Col>
          </FormGroup>
        </TabContent>
      </Formik>
    );
  }
}
let $primary = "#7367F0",
  $danger = "#EA5455",
  $white = "#fff";
export default PropertySummary;
