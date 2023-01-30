import React, { useState, useEffect } from "react";

import { expenditure, department } from "../../data/api";
import axios from "axios";
import Notifications from "components/Notification/Notification";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useAuth } from "contexts/AuthContext";
// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Link } from "react-router-dom";

function Dashboard() {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });

  const [totalUnits, setTotalUnits] = useState(0);
  const [totalAccountedUnits, setTotalAccountedUnits] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [unitsCountByDepartment, setUnitsCountByDepartment] = useState({});
  const [time, setTime] = useState("daily");

  const { userDetail, activeTerm } = useAuth();
  const [graphDetails, setGraphDetails] = useState({});
  const [graphPeriods, setGraphPeriods] = useState({});

  const options = {
    scales: {
      yAxes: [
        {
          display: false,
        },
      ],
      xAxes: [
        {
          display: false,
        },
      ],
    },
  };

  useEffect(
    () => {
      async function fetchBudgetExpenditure() {
        await axios
          .get(
            expenditure.showBudgetVsExpenditure +
              "/" +
              activeTerm.id +
              "/" +
              userDetail.ministryId
          )
          .then(async (response) => {
            if (response.data.status === true) {
              await axios
                .get(
                  expenditure.showDepartmentExpenses +
                    "/" +
                    activeTerm.id +
                    "/" +
                    userDetail.ministryId
                )
                .then((response1) => {
                  if (response1.data.status === true) {
                    setGraphDetails({
                      bVSr: response.data.data,
                      departmentExpenses: response1.data.data,
                    });
                    // setDataLoad(false);
                  } else {
                    setNotificationDetails({
                      msg: "Error Department Expenses, Please Referesh The Page",
                      type: "danger",
                    });
                    setNotificationStatus(true);
                    // setDataLoad(false);
                  }
                });

              // setDataLoad(false);
            } else {
              setNotificationDetails({
                msg: "Error Loading Expenditure VS Budget Please Referesh The Page",
                type: "danger",
              });
              setNotificationStatus(true);
              // setDataLoad(false);
            }
          });
      }

      async function fetchBudgets() {
        await axios
          .get(
            department.showBudgets +
              "/" +
              userDetail.ministryId +
              "/" +
              activeTerm.id
          )
          .then((response) => {
            if (response.data.status === true) {
              setTotalUnits(response.data.totalUnits);
              setTotalDepartments(response.data.totalDepartments);
              setTotalAccountedUnits(response.data.totalAccountedUnits);
              setUnitsCountByDepartment(response.data.unitsCountByDepartment);
              // setDataLoad(false);
            } else {
              setNotificationDetails({
                msg: "Error Loading Ministries, Please Referesh The Page",
                type: "danger",
              });
              setNotificationStatus(true);
              // setDataLoad(false);
            }
          });
      }

      async function fetchDepartmentExpenses() {
        await axios
          .get(
            expenditure.showDepartmentExpenses +
              "/" +
              activeTerm.id +
              "/" +
              userDetail.ministryId
          )
          .then((response) => {
            if (response.data.status === true) {
              setGraphDetails({
                ...graphDetails,
                departmentExpenses: response.data.data,
              });
              // setDataLoad(false);
            } else {
              setNotificationDetails({
                msg: "Error Department Expenses, Please Referesh The Page",
                type: "danger",
              });
              setNotificationStatus(true);
              // setDataLoad(false);
            }
          });
      }

      fetchExpenseByPeriod(time);
      fetchBudgetExpenditure();
      fetchDepartmentExpenses();
      fetchBudgets();
    },
    // eslint-disable-next-line
    []
  );

  async function fetchExpenseByPeriod(time) {
    await axios
      .get(expenditure.showByTime + "/" + userDetail.ministryId + "/" + time)
      .then((response1) => {
        if (response1.data.status === true) {
          setGraphPeriods(response1.data.data);
          // setDataLoad(false);
        } else {
          setNotificationDetails({
            msg: "Error Loading Graph, Please Referesh The Page",
            type: "danger",
          });
          setNotificationStatus(true);
          // setDataLoad(false);
        }
      });

    // setDataLoad(false);
  }

  function arrangeData(gd) {
    const labels = Object.keys(gd || {});
    const data = Object.values(gd || {});

    return {
      labels: labels,
      datasets: [
        {
          id: 1,
          label: "Data",
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
  return (
    <>
      {notificationStatus === true ? (
        <Notifications details={notificationDetails} />
      ) : null}
      <div className="content">
        <Row>
          <Col>
            <Link to="alldepartment">
              <Card className="grow">
                <CardBody>
                  <Row>
                    <Col>
                      <CardHeader>
                        <CardTitle tag="h4">Departments</CardTitle>
                        <CardTitle tag="h5">
                          Total: {totalDepartments}
                        </CardTitle>
                      </CardHeader>
                    </Col>
                    <Col
                      style={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <IoIosAddCircleOutline size={50} />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Link>
          </Col>
          <Col>
            <Link to="allunit">
              <Card className="grow">
                <CardBody>
                  <Row>
                    <Col>
                      <CardHeader>
                        <CardTitle tag="h4">Units</CardTitle>
                        <CardTitle tag="h5">Total: {totalUnits}</CardTitle>
                      </CardHeader>
                    </Col>
                    <Col
                      style={{
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <IoIosAddCircleOutline size={50} />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Link>
          </Col>
          <Col>
            <Card className="grow" href="/admin/ministry">
              <CardBody>
                <Row>
                  <Col>
                    <CardHeader>
                      <CardTitle tag="h4"> Active Term</CardTitle>
                      <CardTitle tag="h5">{activeTerm?.name}</CardTitle>
                    </CardHeader>
                  </Col>
                  <Col
                    style={{
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <IoIosAddCircleOutline size={50} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <CardHeader>Budget : Expenditure Statistics</CardHeader>
              <CardBody>
                <Row>
                  <Doughnut
                    datasetIdKey="id"
                    data={{
                      ...arrangeData(graphDetails?.bVSr || {}),
                    }}
                  />
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardHeader>Department : Expenditure Distribution</CardHeader>
              <CardBody>
                <Row>
                  <Doughnut
                    data={{
                      ...arrangeData(graphDetails.departmentExpenses),
                    }}
                  />
                </Row>
              </CardBody>
            </Card>
          </Col>{" "}
          <Col>
            <Card>
              <CardHeader>Department : Unit Distribution</CardHeader>
              <CardBody>
                <Row>
                  <Bar
                    data={{
                      ...arrangeData(unitsCountByDepartment),
                    }}
                    options={options}
                  />
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col>
            <Card>
              <CardHeader>
                Expenditure Chart : {time.toLocaleUpperCase()}
              </CardHeader>
              <CardBody>
                <Row>
                  <Line
                    data={{
                      ...arrangeData(graphPeriods),
                    }}
                  />
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
