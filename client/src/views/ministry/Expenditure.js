import React, { useState, useEffect } from "react";
import axios from "axios";
import { expenditure as expenditure_api } from "../../data/api";

import Notifications from "components/Notification/Notification";
import { FiArrowLeft, FiGrid } from "react-icons/fi";
import { IoMdAddCircle } from "react-icons/io";
import empty from "../../assets/img/product.svg";
import { Link } from "react-router-dom";
import ExpenditureData from "./ExpenditureData";
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

function Expenditure({ department_id }) {
  const [expenditure, setExpenditure] = useState([]);
  const [currentExpenditure, setCurrentExpenditure] = useState({});
  const { userDetail, activeTerm } = useAuth();
  // const [totalUnits, setTotalUnits] = useState(0);
  // const [totalAccountedUnits, setTotalAccountedUnits] = useState(0);
  // const [unitsCountByDepartment, setUnitsCountByDepartment] = useState({});

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
      async function fetchExpenditure() {
        await axios
          .get(
            expenditure_api.showAllExpenditures +
              "/" +
              userDetail.ministryId +
              "/" +
              activeTerm.id
          )
          .then((response) => {
            if (response.data.status === true) {
              setExpenditure(response.data.data);
              // setTotalUnits(response.data.totalUnits);
              // setTotalAccountedUnits(response.data.totalAccountedUnits);
              // setUnitsCountByDepartment(response.data.unitsCountByDepartment);
              setDataLoad(false);
            } else {
              setNotificationDetails({
                msg: "Error Loading Ministries, Please Referesh The Page",
                type: "danger",
              });
              setNotificationStatus(true);
              setDataLoad(false);
            }
          });
      }
      fetchExpenditure();
    },
    // eslint-disable-next-line
    []
  );

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
                  <Card>
                    <CardHeader>
                      <CardTitle className="pull-left" tag="h4">
                        Expenditure
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
                              placeholder="Search based on expenditure name"
                              type="text"
                              value={q}
                              style={{ width: "100%" }}
                              onChange={(e) => setQ(e.target.value)}
                            />
                          </Link>

                          <Link style={{ marginRight: "15px" }}>
                            <Button
                              className="btn-fill"
                              size="sm"
                              style={{ width: "100%" }}
                              color="primary"
                              type="submit"
                              onClick={() => {
                                setIsAdd(true);
                              }}
                            >
                              <IoMdAddCircle size={20} /> Print Report
                            </Button>
                          </Link>
                        </Row>
                      </div>
                    </CardHeader>{" "}
                  </Card>

                  {dataload === false ? (
                    <>
                      {Object.keys(expenditure).length > 0 ? (
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
                                    <th>Department Name</th>
                                    <th>Total Amount: NGN</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {expenditure.map((row, key) => {
                                    return (
                                      <>
                                        <tr key={key}>
                                          <td>{key + 1} </td>
                                          <td>
                                            <b>{row.department_name}</b>
                                            <br />
                                            {row.units.map((item, k) => {
                                              return (
                                                <Row key={k}>
                                                  <Col>
                                                    Unit: {Object.keys(item)[0]}
                                                  </Col>
                                                  <Col>
                                                    Amount:{" "}
                                                    {Object.values(
                                                      item
                                                    )[0].toLocaleString()}
                                                  </Col>
                                                </Row>
                                              );
                                            })}
                                          </td>
                                          <td>{row.total.toLocaleString()}</td>
                                          <td>
                                            <div>
                                              <Button
                                                onClick={() => {
                                                  setCurrentExpenditure(row);
                                                  setViewMode("current");
                                                  // setHideDepartment(true);
                                                }}
                                                className="btn-fill"
                                                style={{
                                                  marginBottom: "5px",
                                                }}
                                                color="primary"
                                                size="sm"
                                              >
                                                Show
                                              </Button>
                                            </div>
                                          </td>
                                        </tr>
                                      </>
                                    );
                                  })}
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
              ) : (
                <Button
                  style={{ width: "100%", marginBottom: "15px" }}
                  onClick={() => setLoading(!loading)}
                  className="btn-fill"
                  color="primary"
                >
                  <FiArrowLeft size={20} />{" "}
                  <font style={{ paddingLeft: "30px" }}>
                    Back To Expenditure{" "}
                  </font>
                </Button>
              )}
            </Col>
          ) : null}

          {viewMode === "current" ? (
            <ExpenditureData
              currentExpenditure={currentExpenditure}
              setViewMode={setViewMode}
            />
          ) : null}
        </Row>
      </div>
    </>
  );
}

export default Expenditure;
