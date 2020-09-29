import React, { Suspense, lazy } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { history } from "./history";
import { connect } from "react-redux";
import Spinner from "./components/@vuexy/spinner/Loading-spinner";
import { ContextLayout } from "./utility/context/Layout";

// Route-based code splitting

const login = lazy(() => import("./views/pages/authentication/login/Login"));

const taskCreate = lazy(() =>
  import("./components/maintanance/Task/TaskCreate")
);

const taskSearch = lazy(() =>
  import("./components/maintanance/Task/TaskSearch")
);
const maintSearch1 = lazy(() =>
  import("./components/tenant/MaintananceSearch")
);

const maintUpdate = lazy(() => import("./components/tenant/MaintananceUpdate"));

const maintUpdate1 = lazy(() =>
  import("./components/maintanance/summary/MaintananceUpdate")
);

const vendorSearch = lazy(() => import("./components/vendor/VendorSearch"));

const vendorCreate = lazy(() => import("./components/vendor/VendorCreate"));

const vendorUpdate = lazy(() => import("./components/vendor/VendorUpdate"));

const authorized = lazy(() => import("./views/pages/misc/NotAuthorized"));

const sessionExpired = lazy(() => import("./views/pages/misc/error/404"));

const maintenance = lazy(() => import("./views/pages/misc/Maintenance"));

const applicantCreate = lazy(() =>
  import("./components/applicant/ApplicantCreate")
);
const applicantWizard = lazy(() =>
  import("./components/applicant/ApplicantWizard")
);
const tenantSearch = lazy(() =>
  import("./components/applicant/ApplicantSearch")
);

const preApplicantCreate = lazy(() =>
  import("./components/applicant/preapplicant/PreAppCreate")
);

const preApplicantSearch = lazy(() =>
  import("./components/applicant/preapplicant/PreAppSearch")
);

const preApplicantUpdate = lazy(() =>
  import("./components/applicant/preapplicant/PreAppUpdate")
);

const tenantManagement = lazy(() =>
  import("./components/applicant/TenantManagement")
);
const tenantUpdate = lazy(() => import("./components/applicant/General"));

//Admin:::::::
const userCreate = lazy(() => import("./components/admin/user/UserCreate"));

const userSearch = lazy(() => import("./components/admin/user/UserSearch"));

const userUpdate = lazy(() => import("./components/admin/user/UserUpdate"));

const userView = lazy(() => import("./components/admin/user/UserView"));

const roleCreate = lazy(() => import("./components/admin/role/RoleCreate"));

const roleSearch = lazy(() => import("./components/admin/role/RoleSearch"));

const roleUpdate = lazy(() => import("./components/admin/role/RoleUpdate"));

const roleView = lazy(() => import("./components/admin/role/RoleView"));

const lovSearch = lazy(() => import("./components/admin/lov/LovSearch"));

const lovCreate = lazy(() => import("./components/admin/lov/LovCreate"));

const lovUpdate = lazy(() => import("./components/admin/lov/LovUpdate"));

const lovView = lazy(() => import("./components/admin/lov/LovView"));

//Dashboard::::::::::
const mainDashboard = lazy(() =>
  import("./components/dashboard/mainDashboard/MainDashboard")
);

const mainDashboard2 = lazy(() =>
  import("./components/dashboard/analytics/AnalyticsDashboard")
);

const apex = lazy(() => import("./views/charts/apex/ApexCharts"));
const chartjs = lazy(() => import("./views/charts/chart-js/ChartJS"));
const extreme = lazy(() => import("./views/charts/recharts/Recharts"));
//Maintanance:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
const taskSummary = lazy(() =>
  import("./components/maintanance/Task/TaskSummary")
);

const taskUpdate = lazy(() =>
  import("./components/maintanance/Task/TaskUpdate")
);

const workOrder = lazy(() => import("./components/workOrder/WorkOrder"));

const workOrderCreate = lazy(() =>
  import("./components/workOrder/WorkOrderCreate")
);

const reoccurenceSearch = lazy(() =>
  import("./components/maintanance/reoccuring/ReoccurenceSearch")
);
const reoccurenceCreate = lazy(() =>
  import("./components/maintanance/reoccuring/ReoccurenceCreate")
);
const reoccurenceUpdate = lazy(() =>
  import("./components/maintanance/reoccuring/ReoccurenceUpdate")
);
//Leasing:::::::
const leaseSearch = lazy(() => import("./components/leasing/LeaseSearch"));

const leaseCreate = lazy(() => import("./components/leasing/LeaseCreate"));

const leaseView = lazy(() => import("./components/leasing/LeaseView"));

const leaseUpdate = lazy(() => import("./components/leasing/LeaseUpdate"));

const leaseSelection = lazy(() =>
  import("./components/leasing/LeaseSelection")
);

const renewal = lazy(() => import("./components/leasing/renewal/Renewal"));

const offerCreate = lazy(() =>
  import("./components/leasing/renewal/OfferCreate")
);

const offerUpdate = lazy(() =>
  import("./components/leasing/renewal/OfferUpdate")
);

const renewalCreate = lazy(() =>
  import("./components/leasing/renewal/RenewalCreate")
);
const renewalLeaseCreate = lazy(() =>
  import("./components/leasing/renewal/RenewalLeaseCreate")
);
const thumbView = lazy(() => import("./views/ui-elements/data-list/ThumbView"));

//Rentals:::::::
const rentalsSearch = lazy(() => import("./components/rentals/RentManagement"));

const rentUpdate = lazy(() => import("./components/rentals/RentUpdate"));

const paymentSearch = lazy(() =>
  import("./components/rentals/payment/PaymentSearch")
);

const rentalsSummary = lazy(() =>
  import("./components/rentals/RentalsSummary")
);

const propertySummary = lazy(() =>
  import("./components/property/PropertySummary")
);
const propertyCreate = lazy(() =>
  import("./components/property/PropertyCreate")
);
const propertySearch = lazy(() =>
  import("./components/property/PropertySearch")
);
const propertyUpdate = lazy(() =>
  import("./components/property/PropertyUpdate")
);
const unitUpdate = lazy(() =>
  import("./components/property/summary/UnitUpdate")
);

const carPortCreate = lazy(() =>
  import("./components/rentals/carport/CarPortCreate")
);
const carPortUpdate = lazy(() =>
  import("./components/rentals/carport/CarPortUpdate")
);
const carPortSearch = lazy(() =>
  import("./components/rentals/carport/CarPortSearch")
);
//Communication:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
const socialBlog = lazy(() => import("./components/social/SocialBlog"));

const chat = lazy(() => import("./components/chat/Chat"));

const todo = lazy(() => import("./components/apps/todo/Todo"));

const dmsUpload = lazy(() => import("./components/dms/Upload"));
const iMail = lazy(() => import("./components/applicant/iMail/Email"));

// Set Layout and Component Using App Route

const RouteConfig = ({
  component: Component,
  fullLayout,
  permission,
  user,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      return (
        <ContextLayout.Consumer>
          {(context) => {
            if (localStorage.getItem("accessToken")) {
              let LayoutTag =
                fullLayout === true
                  ? context.fullLayout
                  : context.state.activeLayout === "horizontal"
                  ? context.horizontalLayout
                  : context.VerticalLayout;
              return (
                <LayoutTag {...props} permission={props.user}>
                  <Suspense fallback={<Spinner />}>
                    <Component {...props} />
                  </Suspense>
                </LayoutTag>
              );
            } else {
              return <Redirect to="/unauthorized" />;
            }
          }}
        </ContextLayout.Consumer>
      );
    }}
  />
);
const RouteConfig1 = ({
  component: Component,
  fullLayout,
  permission,
  user,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      return (
        <ContextLayout.Consumer>
          {(context) => {
            let LayoutTag =
              fullLayout === true
                ? context.fullLayout
                : context.state.activeLayout === "horizontal"
                ? context.horizontalLayout
                : context.VerticalLayout;
            return (
              <LayoutTag {...props} permission={props.user}>
                <Suspense fallback={<Spinner />}>
                  <Component {...props} />
                </Suspense>
              </LayoutTag>
            );
          }}
        </ContextLayout.Consumer>
      );
    }}
  />
);

const mapStateToProps = (state) => {
  return {
    user: state.auth.login.userRole,
  };
};

console.log(localStorage.getItem("accessToken"));
const AppRoute = connect(mapStateToProps)(RouteConfig);
const AppRoute1 = connect(mapStateToProps)(RouteConfig1);

class AppRouter extends React.Component {
  render() {
    return (
      // Set the directory path if you are deploying in sub-folder

      <Router history={history}>
        <Switch>
          <AppRoute1 exact path="/" component={login} fullLayout />
          <AppRoute1 path="/login" component={login} fullLayout />
          <AppRoute path="/userCreate" component={userCreate} />
          <AppRoute path="/userSearch" component={userSearch} />
          <AppRoute path="/userView/:userId" component={userView} />
          <AppRoute path="/userUpdate/:userId" component={userUpdate} />
          <AppRoute path="/lovSearch" component={lovSearch} />
          <AppRoute path="/lovCreate" component={lovCreate} />
          <AppRoute path="/lovUpdate/:lovId" component={lovUpdate} />
          <AppRoute path="/lovView/:lovId" component={lovView} />
          <AppRoute path="/roleCreate" component={roleCreate} />
          <AppRoute path="/roleSearch" component={roleSearch} />
          <AppRoute path="/roleUpdate/:roleId" component={roleUpdate} />
          <AppRoute path="/roleView/:roleId" component={roleView} />
          <AppRoute path="/mainDashboard" component={mainDashboard} />
          <AppRoute path="/mainDashboard2" component={mainDashboard2} />
          <AppRoute path="/charts/apex" component={apex} />
          <AppRoute path="/charts/chartjs" component={chartjs} />
          <AppRoute path="/charts/recharts" component={extreme} />
          <AppRoute path="/taskCreate" component={taskCreate} />
          <AppRoute path="/taskSearch" component={taskSearch} />
          <AppRoute path="/maintSearch1" component={maintSearch1} />
          <AppRoute path="/maintUpdate/:maintId" component={maintUpdate} />
          <AppRoute path="/maintUpdate1/:maintId" component={maintUpdate1} />
          <AppRoute path="/taskSummary/:taskId" component={taskSummary} />
          <AppRoute path="/reoccurenceSearch" component={reoccurenceSearch} />
          <AppRoute path="/reoccurenceCreate" component={reoccurenceCreate} />
          <AppRoute
            path="/reoccurenceUpdate/:reoccuringId"
            component={reoccurenceUpdate}
          />
          <AppRoute path="/taskUpdate/:taskId" component={taskUpdate} />
          <AppRoute path="/workOrder" component={workOrder} />
          <AppRoute path="/workOrderCreate" component={workOrderCreate} />
          <AppRoute path="/vendorSearch" component={vendorSearch} />
          <AppRoute path="/vendorCreate" component={vendorCreate} />
          <AppRoute path="/vendorUpdate/:vendorId" component={vendorUpdate} />
          <AppRoute path="/chat" component={chat} />
          <AppRoute
            path="/iMail"
            exact
            component={() => <Redirect to="/email/inbox" />}
          />
          <AppRoute path="/iMail/:filter" component={iMail} />
          <AppRoute path="/leaseSearch" component={leaseSearch} />
          <AppRoute path="/leaseCreate/:appReqId" component={leaseCreate} />
          <AppRoute path="/leaseUpdate/:appReqId" component={leaseUpdate} />
          <AppRoute path="/leaseView/:appReqId" component={leaseView} />
          <AppRoute path="/applicantCreate" component={applicantCreate} />
          <AppRoute path="/applicantWizard" component={applicantWizard} />
          <AppRoute path="/preApplicantCreate" component={preApplicantCreate} />
          <AppRoute path="/preApplicantSearch" component={preApplicantSearch} />
          <AppRoute
            path="/preApplicantUpdate/:appReqId"
            component={preApplicantUpdate}
          />
          <AppRoute path="/tenantSearch" component={tenantSearch} />
          <AppRoute path="/leaseSelection" component={leaseSelection} />
          <AppRoute
            path="/tenantManagement/:appReqId"
            component={tenantManagement}
          />
          <AppRoute path="/tenantUpdate" component={tenantUpdate} />
          <AppRoute path="/propertyCreate" component={propertyCreate} />
          <AppRoute path="/propertySearch" component={propertySearch} />
          <AppRoute
            path="/propertyUpdate/:propertyId"
            component={propertyUpdate}
          />
          <AppRoute path="/unitUpdate/:propertyId" component={unitUpdate} />
          <AppRoute path="/socialBlog" component={socialBlog} />
          <AppRoute path="/rentalsSearch" component={rentalsSearch} />
          <AppRoute path="/rentUpdate/:appReqId" component={rentUpdate} />
          <AppRoute path="/rentalsSummary" component={rentalsSummary} />
          <AppRoute
            path="/propertySummary/:propertyId"
            component={propertySummary}
          />
          <AppRoute path="/renewal" component={renewal} />
          <AppRoute path="/offerCreate/:tenantId" component={offerCreate} />
          <AppRoute path="/offerUpdate/:tenantId" component={offerUpdate} />
          <AppRoute
            path="/renewalCreate/:paramValue1"
            component={renewalCreate}
          />
          <AppRoute
            path="/renewalLeaseCreate/:paramValue1"
            component={renewalLeaseCreate}
          />
          <AppRoute path="/paymentSearch" component={paymentSearch} />
          <AppRoute path="/carPortCreate" component={carPortCreate} />
          <AppRoute path="/carPortSearch" component={carPortSearch} />
          <AppRoute path="/carPortUpdate/:cpHdrId" component={carPortUpdate} />
          <AppRoute path="/data-list/thumb-view" component={thumbView} />

          <AppRoute path="/dmsUpload" component={dmsUpload} />
          <AppRoute
            path="/todo"
            exact
            component={() => <Redirect to="/todo/all" />}
          />
          <AppRoute path="/todo/:filter" component={todo} />
          <AppRoute1 path="/unauthorized" component={authorized} fullLayout />
          <AppRoute1
            path="/sessionExpired"
            component={sessionExpired}
            fullLayout
          />
          <AppRoute1 path="/maintenance" component={maintenance} fullLayout />
          <AppRoute1 path="*" component={authorized} fullLayout />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
