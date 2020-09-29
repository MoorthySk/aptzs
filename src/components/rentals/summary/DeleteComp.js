import React, { Component } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import axios from "axios";
import DeleteForever from "@material-ui/icons/DeleteForever";
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
  ModalBody,
  ModalHeader,
  ModalFooter,
  Modal,
  Input,
} from "reactstrap";
const ModalConfig = [
  {
    id: 5,
    btnTitle: "Update",
    modalTitle: "Update Task",
    modalClass: "modal-lg",
    bgColor: "bg-primary",
  },
];
export default class DeleteComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "1",
      active: "1",
    }
  }

 
  toggleModal = (id) => {
    console.log("inside the submit");
    if (this.state.modal !== id) {
      this.setState({
        modal: id,
      });
    } else {
      this.setState({
        modal: null,
      });
    }
  };
  render() {

    const renderModal = ModalConfig.map((item) => {
      return (
        <React.Fragment key={item.id}>
          <div className="d-inline-block mr-1 mb-1">
            
              <DeleteForever
                style={{ fontSize: 25 }}
                color="error"
                onClick={() => this.toggleModal(item.id)}
              
             />
          </div>
          <Modal
            isOpen={this.state.modal === item.id}
            toggle={() => this.toggleModal(item.id)}
            className={`modal-dialog-centered ${item.modalClass}`}
            key={item.id}
          >
            <ModalHeader
              toggle={() => this.toggleModal(item.id)}
              className={item.bgColor}
            >
              {item.modalTitle}
              {item.title}
            </ModalHeader>
            <ModalBody>
              <Formik>
                <Form>
                  <Row>
                    <Col sm="12">
                      <Card>
                        <CardBody>
                          <Col md="12" sm="12">
                            <label htmlFor="mangeNotes">Remarks</label>
                            <FormGroup>
                              <Input
                                type="textarea"
                                name="taskRemarks"
                                rows="3"
                              />
                            </FormGroup>
                          </Col>
                          <Col sm="12">
                            <label htmlFor="leaseEndDate">Due Date</label>
                            <FormGroup>
                              <Input
                                className="form-control"
                                name="dueDate"
                                type="date"
                              />
                            </FormGroup>
                          </Col>
                          <Button type="submit">Update</Button>{" "}
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Form>
              </Formik>
            </ModalBody>
          </Modal>
        </React.Fragment>
      );
    });
    return (
      <span>
      
        <Col md="12" sm="12">
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">{renderModal}</TabPane>
          </TabContent>
        </Col>
      </span>
    );
  }
}
