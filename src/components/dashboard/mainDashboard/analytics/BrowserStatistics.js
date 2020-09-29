import React from "react";
import { Card, CardHeader, CardTitle, CardBody, Progress } from "reactstrap";
import { ArrowUp, ArrowDown } from "react-feather";

class BrowserStats extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Statistics</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="d-flex justify-content-between mb-25">
            <div className="browser-info">
              <p className="mb-25">Electronics Issue</p>
              <h4>73%</h4>
            </div>
            <div className="stastics-info text-right">
              <span>
                800 <ArrowUp size={15} className="text-success" />
              </span>
              <span className="text-muted d-block">13:16</span>
            </div>
          </div>
          <Progress className="mb-2" value="73" />
          <div className="d-flex justify-content-between mb-25">
            <div className="browser-info">
              <p className="mb-25">Eletrical Issue</p>
              <h4>8%</h4>
            </div>
            <div className="stastics-info text-right">
              <span>
                -200 <ArrowDown size={15} className="text-danger" />
              </span>
              <span className="text-muted d-block">13:16</span>
            </div>
          </div>
          <Progress className="mb-2" value="8" />

          <div className="d-flex justify-content-between mb-25">
            <div className="browser-info">
              <p className="mb-25">Common Areas</p>
              <h4>19%</h4>
            </div>
            <div className="stastics-info text-right">
              <span>
                100 <ArrowUp size={15} className="text-success" />
              </span>
              <span className="text-muted d-block">13:16</span>
            </div>
          </div>
          <Progress className="mb-2" value="19" />

          <div className="d-flex justify-content-between mb-25">
            <div className="browser-info">
              <p className="mb-25">Carpentry</p>
              <h4>27%</h4>
            </div>
            <div className="stastics-info text-right">
              <span>
                -450 <ArrowDown size={15} className="text-danger" />
              </span>
              <span className="text-muted d-block">13:16</span>
            </div>
          </div>
          <Progress className="mb-2" value="27" />
        </CardBody>
      </Card>
    );
  }
}
export default BrowserStats;
