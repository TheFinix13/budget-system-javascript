import React, { useState, useEffect } from "react";
import axios from "axios";
import { unit } from "../../data/api";

import Notifications from "components/Notification/Notification";
import { FiArrowLeft } from "react-icons/fi";
import { IoMdAddCircle } from "react-icons/io";
import empty from "../../assets/img/product.svg";

import { Link } from "react-router-dom";
import UnitData from "./UnitData";
import AddUnit from "./AddUnit";
import { useAuth } from "contexts/AuthContext";

// import DepartmentData from "./DepartmentData";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Input,
} from "reactstrap";

function Unit({ department_id }) {
  const [units, setUnits] = useState([]);
  const [currentUnit, setCurrentUnit] = useState({});
  const { userDetail } = useAuth();

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  const [dataload, setDataLoad] = useState(true);
  const [viewMode, setViewMode] = useState("all");
  const [isAdd, setIsAdd] = useState(false);

  useEffect(
    () => {
      async function fetchAllUnits() {
        await axios
          .get(unit.showAllUnits + "/" + userDetail.ministryId)
          .then((response) => {
            if (response.data.status === true) {
              setUnits(response.data.data);
              setDataLoad(false);
            } else {
              setNotificationDetails({
                msg: "Error Loading Units, Please Referesh The Page",
                type: "danger",
              });
              setNotificationStatus(true);
              setDataLoad(false);
            }
          });
      }
      fetchAllUnits();
    },
    // eslint-disable-next-line
    []
  );

  async function updateUnit() {
    await axios.patch(unit.updateUnit, currentUnit).then((res) => {
      if (res.data.status) {
        setNotificationDetails({
          msg: "Unit Updated Successfully",
          type: "success",
          change: res.data.change,
        });
      } else {
        setNotificationDetails({ msg: "Error Updating Unit", type: "danger" });
      }
      setNotificationStatus(true);
    });
  }

  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");

  return (
    <>
      {notificationStatus ? (
        <Notifications details={notificationDetails} />
      ) : null}
      <div className="content">
        <Row>
          {viewMode === "all" ? (
            <Col>
              {loading === true ? (
                <>
                  {isAdd ? (
                    <AddUnit
                      department_id={department_id}
                      setIsAdd={setIsAdd}
                    />
                  ) : (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="pull-left" tag="h4">
                            Units
                          </CardTitle>
                          <div
                            className="pull-right"
                            style={{ marginBottom: "20px" }}
                          >
                            <Row>
                              <Link
                                style={{
                                  paddingRight: "10px",
                                }}
                              >
                                <Input
                                  placeholder="Search based on unit name"
                                  type="text"
                                  value={q}
                                  style={{ width: "100%" }}
                                  onChange={(e) => setQ(e.target.value)}
                                />
                              </Link>
                            </Row>
                          </div>
                        </CardHeader>
                      </Card>

                      {dataload === false ? (
                        <>
                          {units.length > 0 ? (
                            <>
                              <Card>
                                <hr
                                  style={{
                                    backgroundColor: "#aaa",
                                    marginRight: "2%",
                                    marginLeft: "2%",
                                    marginTop: "-15px",
                                  }}
                                />
                                <CardBody>
                                  <Table
                                    className="tablesorter"
                                    responsive
                                    style={{ overflow: "unset" }}
                                  >
                                    <thead className="text-primary">
                                      <tr>
                                        <th>SN</th>
                                        <th>Unit Name</th>
                                        <th>Unit Number</th>
                                        <th>Department</th>
                                        <th>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {units.map((row, key) => (
                                        <tr key={key}>
                                          <td>{key + 1} </td>
                                          <td>{row.name} </td>
                                          <td>{row.number} </td>
                                          <td>{row.Department.name} </td>
                                          <td>
                                            <div>
                                              <Button
                                                onClick={() => {
                                                  setCurrentUnit(row);
                                                  setViewMode("current");
                                                }}
                                                className="btn-fill"
                                                style={{ marginBottom: "5px" }}
                                                color="primary"
                                                size="sm"
                                              >
                                                Show
                                              </Button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </Table>
                                </CardBody>
                              </Card>
                            </>
                          ) : (
                            <Card>
                              <div
                                style={{
                                  color: "#39B54A",
                                  textAlign: "center",
                                  padding: "20px",
                                }}
                              >
                                <img
                                  src={empty}
                                  style={{ marginBottom: "30px" }}
                                  height="250px"
                                  alt="Nothing to show yet"
                                />
                                <br />
                                <CardTitle tag="h4">
                                  Nothing To Show Yet... Add Some Units
                                </CardTitle>
                              </div>
                            </Card>
                          )}
                        </>
                      ) : (
                        "Loading..."
                      )}
                    </>
                  )}
                </>
              ) : (
                <Button
                  style={{ width: "100%", marginBottom: "15px" }}
                  onClick={() => setLoading(!loading)}
                  className="btn-fill"
                  color="primary"
                >
                  <FiArrowLeft size={20} />{" "}
                  <font style={{ paddingLeft: "30px" }}>Back To Units </font>
                </Button>
              )}
            </Col>
          ) : null}

          {viewMode === "current" ? (
            <UnitData currentUnit={currentUnit} setViewMode={setViewMode} />
          ) : null}
        </Row>
      </div>
    </>
  );
}

export default Unit;
