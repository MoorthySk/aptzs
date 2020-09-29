import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import Summary from "./summary/Summary";
import RentalCard from "./summary/RentalCard";
import { XSquare } from "react-feather";
import { Subject, CreditCard, Assignment } from "@material-ui/icons";
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
class RentalsSummary extends React.Component {
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
  componentDidMount() {}
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
                    Financial
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
                    <Assignment />
                    Task
                  </h6>
                </NavLink>
              </NavItem>
            </Nav>
            <Col sm="12">
              <TabContent className="py-50" activeTab={this.state.active}>
                <TabPane tabId="1">
                  <Row>
                    <Col md="9" sm="12">
                      <Summary />
                    </Col>
                    <Col md="3" sm="12">
                      <RentalCard />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  Pie muffin cake macaroon marzipan pudding pastry. Marzipan
                  muffin oat cake sweet roll tootsie roll I love marshmallow pie
                  pastry. Jelly beans I love pie sugar plum sugar plum soufflé
                  liquorice bonbon sesame snaps. Bear claw sugar plum apple pie
                  sesame snaps wafer chocolate bar chocolate cookie gingerbread.
                  Gummies chocolate cake jujubes tart halvah. I love sesame
                  snaps apple pie. Cupcake cookie bear claw pie cotton candy
                  gummies.
                </TabPane>
                <TabPane tabId="3">
                  Biscuit icing jelly halvah apple pie croissant cookie. Toffee
                  chupa chups brownie dessert biscuit wafer lemon drops. Bear
                  claw jujubes I love I love. Marshmallow apple pie sugar plum
                  chocolate cake.Dragée cake muffin. I love I love apple pie
                  biscuit carrot cake croissant macaroon candy. Cheesecake I
                  love cupcake I love candy canes I love. Cupcake macaroon
                  bonbon biscuit jelly sesame snaps tart I love
                  gingerbread.Cupcake cookie bear claw pie cotton candy gummies.
                </TabPane>
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
export default RentalsSummary;
