import React, { Component } from "react";
import {
  Button,
  Progress,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Input,
} from "reactstrap";
import DataTable from "react-data-table-component";
import classnames from "classnames";
import ReactPaginate from "react-paginate";
import Helpers from "../Helpers";
import { history } from "../../../history";
import { ContactMail, Cancel } from "@material-ui/icons";
import {
  Edit,
  Trash,
  ChevronDown,
  Plus,
  Check,
  ChevronLeft,
  ChevronRight,
  XCircle,
} from "react-feather";
import { connect } from "react-redux";
import {
  getData,
  getInitialData,
  deleteData,
  updateData,
  addData,
  filterData,
} from "../../../redux/actions/data-list/";
import Sidebar from "./CheckListUpdate";
import Chip from "../../../components/@vuexy/chips/ChipComponent";
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy";

import "../../../assets/scss/plugins/extensions/react-paginate.scss";
import "../../../assets/scss/pages/data-list.scss";

const chipColors = {
  hold: "warning",
  completed: "success",
  inprogress: "primary",
  canceled: "danger",
};

const selectedStyle = {
  rows: {
    selectedHighlighStyle: {
      backgroundColor: "rgba(115,103,240,.05)",
      color: "#7367F0 !important",
      boxShadow: "0 0 1px 0 #7367F0 !important",
      "&:hover": {
        transform: "translateY(0px) !important",
      },
    },
  },
};
const data = [
  {
    id: 1,
    order_status: "completed",
    name: "Application Status",
    category: "Jhon",
    price: "69.99",
    popularity: { popValue: "97", color: "success" },
    img: require("../../../assets/img/elements/applicant.png"),
  },
  {
    id: 2,
    popularity: { popValue: "83", color: "success" },
    img: require("../../../assets/img/elements/security.png"),
    order_status: "completed",
    name: "Security Deposit",
    category: "Jhon",
    price: "69.99",
  },
  {
    id: 3,
    price: "199.99",
    popularity: { popValue: "57", color: "warning" },
    img: require("../../../assets/img/elements/pet.png"),
    order_status: "canceled",
    name: "Pet Approval",
    category: "Jhon",
  },
  {
    id: 4,
    img: require("../../../assets/img/elements/utility.png"),
    order_status: "inprogress",
    name: "Utlity Providers Status",
    category: "Olivia",
    price: "199.99",
    popularity: { popValue: "65", color: "primary" },
  },
  {
    id: 5,
    category: "Olivia",
    price: "199.99",
    popularity: { popValue: "87", color: "success" },
    img: require("../../../assets/img/elements/lease.png"),
    order_status: "inprogress",
    name: "Lease Status",
  },
];
const ActionsComponent = (props) => {
  return (
    <div className="data-list-action">
      <Edit
        className="cursor-pointer mr-1"
        size={20}
        onClick={() => {
          if (props.row.id == 5) {
            history.push("/leaseCreate/" + props.appReqId);
          } else {
            console.log("success else");
            return props.currentData(props.row);
          }
        }}
      />
    </div>
  );
};

class DataListConfig extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.dataList.data.length !== data.length) {
      return {
        data: data,
        allData: props.dataList.filteredData,
        totalPages: props.dataList.totalPages,

        totalRecords: props.dataList.totalRecords,
        sortIndex: props.dataList.sortIndex,
      };
    }

    // Return null if the state hasn't changed
    return null;
  }

  state = {
    totalPages: 0,
    currentPage: 0,
    data: [],
    allData: [],
    value: "",
    rowsPerPage: 4,
    sidebar: false,
    currentData: null,
    selected: [],
    totalRecords: 0,
    sortIndex: [],
    addNew: "",
    applicantStatus: "",
  };

  thumbView = true;

  componentDidMount() {
    console.log("this.props.applicantId" + this.props.applicantId);
    this.props.getData(this.props.parsedFilter);
    this.props.getInitialData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.thumbView) {
      this.thumbView = false;
      let columns = [
        {
          name: "Process",
          selector: "img",
          minWidth: "220px",
          cell: (row) => <img src={row.img} height="100" alt={row.name} />,
        },
        {
          name: "Name",
          selector: "name",
          sortable: true,
          minWidth: "250px",
          cell: (row) => (
            <p title={row.name} className="text-truncate text-bold-500 mb-0">
              {row.name}
            </p>
          ),
        },
        {
          name: "Verified By",
          selector: "category",
          sortable: true,
        },

        {
          name: "Status",
          selector: "order_status",
          sortable: true,
          cell: (row) => (
            <Chip
              className="m-0"
              color={chipColors[row.order_status]}
              text={row.order_status}
            />
          ),
        },

        {
          name: "Actions",
          sortable: true,
          cell: (row) => (
            <ActionsComponent
              row={row}
              getData={this.props.getData}
              parsedFilter={this.props.parsedFilter}
              currentData={this.handleCurrentData}
              deleteRow={this.handleDelete}
              appReqId={this.props.applicantId}
            />
          ),
        },
      ];
      this.setState({ columns });
    }
  }

  handleFilter = (e) => {
    this.setState({ value: e.target.value });
    this.props.filterData(e.target.value);
  };

  handleSidebar = (boolean, addNew = false) => {
    console.log("boolean" + boolean);
    this.setState({ sidebar: boolean });
    if (addNew === true) this.setState({ currentData: null, addNew: true });
  };
  updateData = (obj) => {
    console.log("obj.applicantStatus" + obj.name);
    if (obj.applicantStatus == 2051) {
      this.setState({ applicantStatus: "In Progress" });
    }
  };

  handleCurrentData = (obj) => {
    this.setState({ currentData: obj });
    this.handleSidebar(true);
  };

  render() {
    let {
      columns,
      data,
      allData,
      totalPages,
      value,
      rowsPerPage,
      currentData,
      sidebar,
      totalRecords,
      sortIndex,
    } = this.state;
    return (
      <div
        className={`data-list ${
          this.props.thumbView ? "thumb-view" : "list-view"
        }`}
      >
        <div className="app-action">
          <div className="action-right">
            <ul className="list-inline m-0">
              <li className="list-inline-item">
                <Button.Ripple
                  block
                  className="btn-block"
                  color="primary"
                  onClick={() => history.push("/iMail/" + "1002")}
                >
                  <ContactMail size={14} />
                  <span className="align-middle ml-50">i-Mail</span>
                </Button.Ripple>
              </li>
              <li className="list-inline-item">
                <Button.Ripple
                  block
                  className="btn-block"
                  color="warning"
                  onClick={Helpers.handleCancel}
                >
                  <Cancel size={14} />
                  <span className="align-middle ml-50">Back</span>
                </Button.Ripple>
              </li>
            </ul>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={value.length ? allData : data}
          defaultPageSize={10}
          noHeader
          subHeader
          responsive
          pointerOnHover
        />
        <Sidebar
          show={sidebar}
          data={currentData}
          updateData={this.updateData}
          addData={this.props.addData}
          handleSidebar={this.handleSidebar}
          thumbView={this.props.thumbView}
          getData={this.props.getData}
          dataParams={this.props.parsedFilter}
          addNew={this.state.addNew}
          appId={this.props.applicantId}
        />
        <div
          className={classnames("data-list-overlay", {
            show: sidebar,
          })}
          onClick={() => this.handleSidebar(false, true)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dataList: state.dataList,
  };
};

export default connect(mapStateToProps, {
  getData,
  deleteData,
  updateData,
  addData,
  getInitialData,
  filterData,
})(DataListConfig);
