import React from "react";
import * as Icon from "react-feather";
import {
  Accessibility,
  AcUnitSharp,
  Dashboard,
  SupervisorAccount,
  BusinessTwoTone,
  EmojiTransportationTwoTone,
  SupervisedUserCircleTwoTone,
  AccessibilityNew,
  FormatListBulletedRounded,
  GroupAddRounded,
  DeckRounded,
  ChatSharp,
  PaymentTwoTone,
  SportsKabaddiTwoTone,
  HomeWork,
  AssignmentTurnedIn,
  AssignmentInd,
  GroupWork,
  PeopleAltOutlined,
  Payment,
  DirectionsCar,
  CheckBoxOutlined,
  AppsOutlined,
  PieChart,
} from "@material-ui/icons";
const permissionList = [
  "Admin",
  "CEO",
  "sendu",
  "Manager",
  "Founder",
  "Technical Arc",
];

const navigationConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "collapse",
    icon: <Dashboard size={20} color="primary" />,
    badge: "warning",
    permissions: permissionList,

    children: [
      {
        id: "dashboard1",
        title: "Dashboard 1",
        type: "item",
        icon: <Icon.Circle size={12} color="primary" />,
        //permissions: RbacList.rbacMenuList(dashboard),
        permissions: permissionList,
        navLink: "/mainDashboard",
      },
      {
        id: "dashboard2",
        title: "Dashboard 2",
        type: "item",
        icon: <Icon.Circle size={12} color="primary" />,
        permissions: permissionList,
        navLink: "/mainDashboard2",
      },
    ],
  },
  {
    id: "charts",
    title: "Charts",
    type: "collapse",
    badge: "success",
    badgeText: "3",
    icon: <PieChart size={12} color="primary" />,
    children: [
      {
        id: "apex",
        title: "Apex",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: permissionList,
        navLink: "/charts/apex",
      },
      {
        id: "chartJs",
        title: "ChartJS",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: permissionList,
        navLink: "/charts/chartjs",
      },
      {
        id: "recharts",
        title: "Recharts",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: permissionList,
        navLink: "/charts/recharts",
      },
    ],
  },

  {
    id: "admin",
    title: "Admin",
    type: "collapse",
    icon: <SupervisorAccount size={20} color="primary" />,
    badge: "warning",
    permissions: permissionList,
    children: [
      {
        id: "userCreate",
        title: "User Master",
        type: "item",
        icon: <SupervisedUserCircleTwoTone size={20} color="primary" />,
        //permissions: [localStorage.getItem("UserMaster")],
        permissions: permissionList,
        navLink: "/userSearch",
      },
      {
        id: "rolemaster",
        title: "Role Master",
        type: "item",
        icon: <AccessibilityNew size={12} color="primary" />,
        //permissions: [localStorage.getItem("RoleMaster")],
        permissions: permissionList,
        navLink: "/roleSearch",
      },
      {
        id: "lovmaster",
        title: "Lov Master",
        type: "item",
        icon: <FormatListBulletedRounded size={20} color="primary" />,
        permissions: permissionList,
        //permissions: [localStorage.getItem("LovMaster")],
        navLink: "/lovSearch",
      },
    ],
  },
  {
    id: "apps",
    title: "Apps",
    type: "collapse",
    icon: <AppsOutlined size={20} color="primary" />,
    badge: "warning",
    permissions: permissionList,
    children: [
      {
        id: "todo",
        title: "Todo",
        type: "item",
        icon: <CheckBoxOutlined size={12} color="primary" />,
        permissions: permissionList,
        navLink: "/todo/:filter",
        filterBase: "/todo/all",
      },
      {
        id: "socialBlog",
        title: "Social Blog",
        type: "item",
        icon: <DeckRounded size={12} color="primary" />,
        permissions: permissionList,
        navLink: "/socialBlog",
      },
      {
        id: "chatapp",
        title: "Chat App",
        type: "item",
        icon: <ChatSharp size={12} color="primary" />,
        permissions: permissionList,
        navLink: "/chat",
      },
    ],
  },

  {
    id: "rentals",
    title: "Rentals",
    type: "collapse",
    icon: <BusinessTwoTone size={20} color="primary" />,
    badge: "warning",
    permissions: permissionList,
    children: [
      {
        id: "propertySearch",
        title: "Property",
        type: "item",
        icon: <HomeWork size={20} color="primary" />,
        permissions: permissionList,
        navLink: "/propertySearch",
      },
      {
        id: "rentalSearch",
        title: "Rent",
        type: "item",
        icon: <Payment size={20} color="primary" />,
        permissions: permissionList,
        navLink: "/rentalsSearch",
      },
      {
        id: "carPort",
        title: "Car Port",
        type: "item",
        icon: <DirectionsCar size={20} color="primary" />,
        permissions: permissionList,
        navLink: "/carPortSearch",
      },

      {
        id: "paymentSearch",
        title: "Payment",
        type: "item",
        icon: <ChatSharp size={12} color="primary" />,
        permissions: permissionList,
        navLink: "/paymentSearch",
      },
    ],
  },
  {
    id: "leasing",
    title: "Leasing",
    type: "collapse",
    icon: <AssignmentInd size={20} color="primary" />,
    badge: "warning",
    permissions: permissionList,
    children: [
      {
        id: "preApplicantSearch",
        title: "Pre-Applicant",
        type: "item",
        icon: <GroupAddRounded size={20} color="primary" />,
        permissions: permissionList,
        navLink: "/preApplicantSearch",
      },
      {
        id: "tenantSearch",
        title: "Applicant",
        type: "item",
        icon: <GroupAddRounded size={20} color="primary" />,
        permissions: permissionList,
        navLink: "/tenantSearch",
      },
      {
        id: "leaseSearch",
        title: "Lease",
        type: "item",
        icon: <GroupAddRounded size={20} color="primary" />,
        permissions: permissionList,
        navLink: "/leaseSearch",
      },
      {
        id: "renewal",
        title: "Renewal",
        type: "item",
        icon: <GroupAddRounded size={20} color="primary" />,
        permissions: permissionList,
        navLink: "/renewal",
      },
    ],
  },
  {
    id: "maintanance",
    title: "Maintanance",
    type: "collapse",
    icon: <SportsKabaddiTwoTone size={20} color="primary" />,
    badge: "warning",
    permissions: permissionList,
    children: [
      {
        id: "taskSearch",
        title: "Task",
        type: "item",
        icon: <AssignmentTurnedIn size={20} color="primary" />,
        permissions: permissionList,
        navLink: "/taskSearch",
      },
      {
        id: "workOrder",
        title: "Work Order",
        type: "item",
        icon: <GroupWork size={20} color="primary" />,
        permissions: permissionList,
        navLink: "/workOrder",
      },
      {
        id: "reoccurenceSearch",
        title: "Re Occurrence",
        type: "item",
        icon: <AssignmentTurnedIn size={20} color="primary" />,
        permissions: permissionList,
        navLink: "/reoccurenceSearch",
      },
      {
        id: "vendorSearch",
        title: "Vendor",
        type: "item",
        icon: <PeopleAltOutlined size={20} color="primary" />,
        permissions: permissionList,
        navLink: "/vendorSearch",
      },
    ],
  },
  {
    id: "tenant",
    title: "Tenant",
    type: "collapse",
    icon: <EmojiTransportationTwoTone size={20} color="primary" />,
    badge: "warning",
    permissions: permissionList,
    children: [
      {
        id: "maintSearch",
        title: "Maintanance",
        type: "item",
        icon: <SportsKabaddiTwoTone size={20} color="primary" />,
        permissions: permissionList,
        navLink: "/maintSearch1",
      },
      {
        id: "payment",
        title: "Payment",
        type: "item",
        icon: <PaymentTwoTone size={12} color="primary" />,
        permissions: permissionList,
        navLink: "/",
      },
      {
        id: "socialBlog",
        title: "Social Blog",
        type: "item",
        icon: <DeckRounded size={12} color="primary" />,
        permissions: permissionList,
        navLink: "/socialBlog",
      },
      {
        id: "chatapp",
        title: "Chat App",
        type: "item",
        icon: <ChatSharp size={12} color="primary" />,
        permissions: permissionList,
        navLink: "/chat",
      },
    ],
  },
];

export default navigationConfig;
