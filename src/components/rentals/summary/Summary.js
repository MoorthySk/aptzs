import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
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
  Table,
} from "reactstrap";

import classnames from "classnames";
class Summary extends React.Component {
  state = {
    activeTab: "1",
    active: "1",
  };

  componentDidMount() {}
  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state;
    return (
      <Formik>
        <Card>
          <CardBody>
            <h6 className="primary">Lease details :</h6>

            <Row>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>Lease Start Date</th>
                    <th>Lease End Date</th>
                    <th>Days Left</th>
                    <th>Lease Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>05/01/2020</td>
                    <td>04/31/2021</td>
                    <td>350</td>
                    <td className="success">Active</td>
                  </tr>
                </tbody>
              </Table>

              <Col md="12" sm="12">
                <h6 className="primary">Lease Comments :</h6>
                <hr />
                <FormGroup className="has-icon-left position-relative">
                  <label>Comments</label>
                </FormGroup>
              </Col>
            </Row>
            <h6 className="primary">Documents :</h6>

            <Row>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Created date</th>
                    <th>File</th>
                    <th>Active Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Lease Documents</td>
                    <td>04/31/2021</td>
                    <td>lease.pdf</td>
                    <td>Active</td>
                  </tr>
                </tbody>
              </Table>
            </Row>
          </CardBody>
        </Card>
      </Formik>
    );
  }
}
export default Summary;
