import React, { Component } from "react";
import { Label, Input, FormGroup, Button } from "reactstrap";
import { X } from "react-feather";
import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";
import * as appConst from "../../../utility/Constants";
import LovList from "../../common/Helpers";
import axios from "axios";
import Select from "react-select";
class DataListSidebar extends Component {
  state = {
    id: "",
    name: "",
    category: "Audio",
    order_status: "pending",
    price: "",
    img: "",
    popularity: {
      popValue: "",
    },
    statusList: [],
    applicantStatus: "",
    applicantRemarks: "",
  };

  addNew = false;
  async componentDidMount() {
    this.state.statusList = await LovList.lovList(appConst.statusList);

    console.log("this.props" + this.props.appId);
    var applicantStatus = "";
    var responseCode = "";

    await axios
      .post("/lease/app-search-byid/", {
        appReqstId: this.state.applicantId,
      })

      .then((response) => {
        responseCode = response.data.responseCode;
        applicantStatus = response.data.appInfo.applicantStatus;
        console.log("applicantStatus:::::::::::::" + applicantStatus);
        if (this._isMounted) {
          this.setState({
            applicantStatus: applicantStatus,
          });
        }
      })
      .catch((error) => {
        console.log("Concurrent Login Issue:::" + error);
      });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.data !== null && prevProps.data === null) {
      if (this.props.data.id !== prevState.id) {
        this.setState({ id: this.props.data.id });
      }
      if (this.props.data.name !== prevState.name) {
        this.setState({ name: this.props.data.name });
      }
      if (this.props.data.category !== prevState.category) {
        this.setState({ category: this.props.data.category });
      }
      if (this.props.data.popularity.popValue !== prevState.popularity) {
        this.setState({
          popularity: {
            ...this.state.popularity,
            popValue: this.props.data.popularity.popValue,
          },
        });
      }
      if (this.props.data.order_status !== prevState.order_status) {
        this.setState({ order_status: this.props.data.order_status });
      }
      if (this.props.data.price !== prevState.price) {
        this.setState({ price: this.props.data.price });
      }
      if (this.props.data.img !== prevState.img) {
        this.setState({ img: this.props.data.img });
      }
    }
    if (this.props.data === null && prevProps.data !== null) {
      this.setState({
        id: "",
        name: "",
        category: "Audio",
        order_status: "pending",
        price: "",
        img: "",
        popularity: {
          popValue: "",
        },
      });
    }
    if (this.addNew) {
      this.setState({
        id: "",
        name: "",
        category: "Audio",
        order_status: "pending",
        price: "",
        img: "",
        popularity: {
          popValue: "",
        },
      });
    }
    this.addNew = false;
  }

  handleSubmit = (obj) => {
    console.log("name " + obj.applicantStatus);
    let payload = {
      appHdr: {
        appReqId: this.props.appId,
        applicantStatus: obj.applicantStatus,
        remarks: obj.mangeNotes,
      },
    };
    if (obj.applicantStatus == 2051) {
      this.state.applicantStatus = "In Progress";
    }
    axios({
      method: "POST",
      url: "/lease/applicant-approval/",
      data: payload,
    })
      .then((response) => {
        let responseCode = response.data.responseCode;
        console.log("Response Code:::::::::::::" + responseCode);
        if (responseCode == 1000) {
          // this.successMessgae("successAlert", true);
        } else {
          // this.errorMessgae("errorAlert", true);
        }
      })
      .catch((error) => {
        console.log(error);
        // toast.error("Bad Request, Please verify your inputs!");
      });
    if (this.props.data !== null) {
      this.props.updateData(obj);
    } else {
      this.addNew = true;
      this.props.addData(obj);
    }
    let params = this.props.dataParams;

    this.props.handleSidebar(false, true);
    this.props.getData("obj");
  };

  render() {
    const { show, handleSidebar, data, setFieldValue } = this.props;
    const {
      name,
      category,
      order_status,
      price,
      popularity,
      img,
      statusList,
      applicantStatus,
      applicantRemarks,
      id,
    } = this.state;
    return (
      <div
        className={classnames("data-list-sidebar", {
          show: show,
        })}
      >
        <div className="data-list-sidebar-header mt-2 px-2 d-flex justify-content-between">
          <h4>{data !== null ? "UPDATE DATA" : "ADD NEW DATA"}</h4>
          <X size={20} onClick={() => handleSidebar(false, true)} />
        </div>
        <PerfectScrollbar
          className="data-list-fields px-2 mt-3"
          options={{ wheelPropagation: false }}
        >
          <FormGroup>
            <Label for="data-name">Name</Label>
            <Input
              type="text"
              value={name}
              placeholder="Apple IphoneX"
              onChange={(e) => this.setState({ name: e.target.value })}
              id="data-name"
            />
          </FormGroup>
          {id == 1 && (
            <div>
              <FormGroup>
                <Label for="data-status">Status</Label>
                <Select
                  type="select"
                  name="applicantStatus"
                  options={statusList}
                  value={statusList.find((obj) => obj.value == applicantStatus)}
                  onChange={(e) => this.setState({ applicantStatus: e.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="data-category">Remarks</Label>
                <Input
                  type="textarea"
                  id="data-category"
                  value={applicantRemarks}
                  onChange={(e) =>
                    this.setState({ applicantRemarks: e.target.value })
                  }
                ></Input>
              </FormGroup>
            </div>
          )}
          {id == 2 && (
            <div>
              <FormGroup>
                <Label for="data-popularity">Popularity</Label>
                <Input
                  type="number"
                  value={popularity.popValue}
                  id="data-popularity"
                  placeholder="0 - 100%"
                  onChange={(e) =>
                    this.setState({
                      popularity: { popularity, popValue: e.target.value },
                    })
                  }
                />
              </FormGroup>
              <FormGroup>
                <Label for="data-status">Status</Label>
                <Select
                  type="select"
                  name="applicantStatus"
                  options={statusList}
                  value={statusList.find((obj) => obj.value == applicantStatus)}
                  onChange={(e) => this.setState({ applicantStatus: e.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label for="data-price">Price</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => this.setState({ price: e.target.value })}
                  id="data-price"
                  placeholder="69.99"
                />
              </FormGroup>
            </div>
          )}
          {this.props.thumbView && img.length <= 0 ? (
            <label
              className="btn btn-primary"
              htmlFor="upload-image"
              color="primary"
            >
              Upload Image
              <input
                type="file"
                id="upload-image"
                hidden
                onChange={(e) =>
                  this.setState({ img: URL.createObjectURL(e.target.files[0]) })
                }
              />
            </label>
          ) : null}
        </PerfectScrollbar>
        <div className="data-list-sidebar-footer px-2 d-flex justify-content-start align-items-center mt-1">
          <Button color="primary" onClick={() => this.handleSubmit(this.state)}>
            {data !== null ? "Update" : "Submit"}
          </Button>
          <Button
            className="ml-1"
            color="danger"
            outline
            onClick={() => handleSidebar(false, true)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
}
export default DataListSidebar;
