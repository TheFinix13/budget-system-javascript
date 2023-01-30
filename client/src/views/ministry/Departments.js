import React, { useState, useEffect } from "react";
import axios from "axios";
import { department } from "../../data/api";

import Notifications from "components/Notification/Notification";
import { FiArrowLeft } from "react-icons/fi";

import empty from "../../assets/img/product.svg";
import { IoMdAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import DepartmentData from "./DepartmentData";

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
import { useAuth } from "contexts/AuthContext";
import { Bar } from "react-chartjs-2";
import AddDepartment from "./AddDepartment";

function AllDepartment({ ministry_id }) {
  const [show_AllDepartment, setShow_AllDepartment] = useState([]);
  const [currentDepartment, setCurrentDepartment] = useState({});
  const { userDetail, activeTerm } = useAuth();
  // const [totalUnits, setTotalUnits] = useState(0);
  // const [totalAccountedUnits, setTotalAccountedUnits] = useState(0);
  const [unitsCountByDepartment, setUnitsCountByDepartment] = useState({});
  const [isAdd, setIsAdd] = useState(false);
  const [ministryId, setMinistryId] = useState(
    ministry_id || userDetail.ministryId
  );

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  const [dataload, setDataLoad] = useState(true);
  const [viewMode, setViewMode] = useState("all");

  useEffect(
    () => {
      async function fetchAllDeparts() {
        await axios
          .get(department.showDepartments + "/" + ministryId)
          .then((response) => {
            if (response.data.status === true) {
              setShow_AllDepartment(response.data.data);
              setDataLoad(false);
            } else {
              setNotificationDetails({
                msg: "Error Loading Departments, Please Referesh The Page",
                type: "danger",
              });
              setNotificationStatus(true);
              setDataLoad(false);
            }
          });
      }
      fetchAllDeparts();
      async function fetchBudgets() {
        await axios
          .get(department.showBudgets + "/" + ministryId + "/" + activeTerm.id)
          .then((response) => {
            if (response.data.status === true) {
              // setTotalUnits(response.data.totalUnits);
              // setTotalAccountedUnits(response.data.totalAccountedUnits);
              setUnitsCountByDepartment(response.data.unitsCountByDepartment);
              setDataLoad(false);
            } else {
              setNotificationDetails({
                msg: "Error Loading Budgets, Please Referesh The Page",
                type: "danger",
              });
              setNotificationStatus(true);
              setDataLoad(false);
            }
          });
      }
      fetchBudgets();
    },
    // eslint-disable-next-line
    []
  );

  const [loading, setLoading] = useState(true);
  function arrangeData(x) {
    const labels = Object.keys(x);
    const data = Object.values(x);

    return {
      labels: labels,
      datasets: [
        {
          id: 1,
          label: "Unit Distribution",
          data: data,
          backgroundColor: [
            "rgba(255, 206, 86)",
            "rgba(75, 192, 192)",
            "rgba(153, 102, 255)",
            "rgba(255, 159, 64)",
            "rgba(255, 99, 132)",
            "rgba(54, 162, 235)",
          ],
          borderColor: [
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
          ],
        },
      ],
    };
  }

  const [q, setQ] = useState("");

  return (
    <>
      {notificationStatus ? (
        <Notifications details={notificationDetails} />
      ) : null}
      {!isAdd ? (
        <div className="content">
          <Row>
            {viewMode === "all" ? (
              <Col md="12">
                {loading === true ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="pull-left" tag="h4">
                          Departments
                        </CardTitle>
                        <div
                          className="pull-right"
                          style={{ marginBottom: "20px" }}
                        >
                          <Row>
                            <Link style={{ paddingRight: "10px" }}>
                              <Input
                                placeholder="Search based on department name"
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
                                <IoMdAddCircle size={20} /> Add Department
                              </Button>
                            </Link>
                          </Row>
                        </div>
                      </CardHeader>
                    </Card>

                    {dataload === false ? (
                      <>
                        {show_AllDepartment.length > 0 ? (
                          <>
                            <Card>
                              <CardBody>
                                <Table
                                  className="tablesorter"
                                  responsive
                                  style={{ overflow: "unset" }}
                                >
                                  <thead className="text-primary">
                                    <tr>
                                      <th>Department Name</th>
                                      <th>Description</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {show_AllDepartment.map((row, key) => (
                                      <tr key={key}>
                                        <td key={key}>{row.name} </td>
                                        <td key={key}>{row.description} </td>
                                        <td>
                                          <Button
                                            onClick={() => {
                                              setCurrentDepartment(row);
                                              setViewMode("current");
                                            }}
                                            className="btn-fill"
                                            style={{ marginBottom: "5px" }}
                                            color="primary"
                                            size="sm"
                                          >
                                            Show
                                          </Button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </CardBody>
                            </Card>
                            <Row>
                              <Col>
                                <Card>
                                  <CardBody>
                                    <Bar
                                      data={{
                                        ...arrangeData(unitsCountByDepartment),
                                      }}
                                    />
                                  </CardBody>
                                </Card>
                              </Col>
                              <Col>
                                <Card>
                                  <CardBody>
                                    <Bar
                                      data={{
                                        ...arrangeData(unitsCountByDepartment),
                                      }}
                                    />
                                  </CardBody>
                                </Card>
                              </Col>
                            </Row>
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
                                Nothing To Show Yet... Add Some Departments to
                                The System
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
                    <font style={{ paddingLeft: "30px" }}>Back To Home </font>
                  </Button>
                )}
              </Col>
            ) : null}

            {viewMode === "current" ? (
              <DepartmentData
                currentDepartment={currentDepartment}
                setCurrentDepartment={setCurrentDepartment}
                setViewMode={setViewMode}
              />
            ) : null}
          </Row>
        </div>
      ) : (
        <>
          <AddDepartment setIsAdd={setIsAdd} ministry_id={ministryId} />
        </>
      )}
    </>
  );
}

export default AllDepartment;
