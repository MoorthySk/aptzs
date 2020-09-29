import React from "react";
import { Formik, Field, ErrorMessage } from "formik";

import LeaseActive from "../renewal/LeaseActive";
import OfferSearch from "../renewal/OfferSearch";
import RenewalSearch from "../renewal/RenewalSearch";
import MoveOutSearch from "../renewal/MoveOutSearch";
import { XSquare } from "react-feather";
import ThumbViewConfig from "./offer/DataListConfig";
import queryString from "query-string";
import { green } from "@material-ui/core/colors";
import {
  Subject,
  CreditCard,
  Assignment,
  LocalOffer,
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
class Renewal extends React.Component {
  state = {
    activeTab: "1",
    active: "1",
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
    this.props.history.push("/rentalsSearch");
  };
  reload = () => {
    window.location.reload();
  };
  componentDidMount() {
    var tabId = this.props.match.params.pathParam;
    if (tabId != null) {
      this.toggle(tabId);
      //this.reload();
    }
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
                    <Subject style={{ color: green[500] }} />
                    Lease Active
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
                    <LocalOffer style={{ color: green[500] }} />
                    Offers
                  </h6>
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
                  <h6>
                    <Assignment style={{ color: green[500] }} />
                    Renewal
                  </h6>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.active === "4",
                  })}
                  onClick={() => {
                    this.toggle("4");
                  }}
                >
                  <h6>
                    <Assignment style={{ color: green[500] }} />
                    Moved Out
                  </h6>
                </NavLink>
              </NavItem>
            </Nav>
            <Col sm="12">
              <TabContent className="py-50" activeTab={this.state.active}>
                <TabPane tabId="1">
                  <Row>
                    <Col md="12" sm="12">
                      <LeaseActive />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Col md="12" sm="12">
                    <OfferSearch />
                  </Col>
                </TabPane>
                <TabPane tabId="3">
                  <Col sm="12">
                    <Col md="12" sm="12">
                      <RenewalSearch />
                    </Col>
                  </Col>
                </TabPane>
                <TabPane tabId="4">
                  <Col sm="12">
                    <Col md="12" sm="12">
                      <MoveOutSearch />
                    </Col>
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
export default Renewal;
