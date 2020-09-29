import React from "react";
import { Formik } from "formik";
import { Row, CardBody, Card, Button, Col } from "reactstrap";

import { Flare } from "@material-ui/icons";
class RentalCard extends React.Component {
  state = {
    activeTab: "1",
    active: "1",
  };

  componentDidMount() {}
  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state;
    return (
      <Formik>
        <Row>
          <Card>
            <CardBody>
              <Row>
                <Col md="8" sm="12" className="text-left">
                  <dt>Balance:</dt>
                </Col>
                <Col md="4" sm="12" className="text-Right">
                  <h6>$ 875</h6>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md="8" sm="12" className="text-left">
                  <dt>Deposits Held:</dt>
                </Col>
                <Col md="4" sm="12" className="text-Right">
                  <dd>$ 875</dd>
                </Col>
                <Col md="8" sm="12" className="text-left">
                  <dt>Monthly Rent :</dt>
                </Col>
                <Col md="4" sm="12" className="text-Right">
                  <dd>$ 875</dd>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col sm="12" className="text-left">
                  <dd>
                    Payment is due on the 1st of the month. Late fees will never
                    exceed $100.00 per month.
                  </dd>
                </Col>
              </Row>
              <Button.Ripple
                block
                color="primary"
                className="w-100 box-shadow-1 mt-2"
              >
                Payments
              </Button.Ripple>
              <div className="divider divider-warning">
                <div className="divider-text">
                  <Flare></Flare>
                </div>
              </div>
              <small>Earned: $56,156</small>
              <small>Duration: 2y</small>
            </CardBody>
          </Card>
        </Row>
      </Formik>
    );
  }
}
export default RentalCard;
