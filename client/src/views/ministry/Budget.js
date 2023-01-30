import React, { useState, useEffect } from "react";
import axios from "axios";
import { budget_request, department } from "data/api";

import Notifications from "components/Notification/Notification";
import { FiArrowLeft } from "react-icons/fi";
import { IoMdAddCircle } from "react-icons/io";
import empty from "../../assets/img/product.svg";
import { Link } from "react-router-dom";
import BudgetData from "./BudgetData";
import AddBudget from "./AddBudget";
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
  Modal,
  ModalHeader,
  ModalBody,
  Input,
} from "reactstrap";

function Budget({ department_id, ministry_id }) {
  const [budgets, setBudgets] = useState([]);
  const [currentBudget, setCurrentBudget] = useState({});

  const { userDetail, setUserDetail, activeTerm } = useAuth();
  const [totalUnits, setTotalUnits] = useState(0);
  const [totalAccountedUnits, setTotalAccountedUnits] = useState(0);
  const [unitsCountByDepartment, setUnitsCountByDepartment] = useState({});

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });

  const ministryId = ministry_id || userDetail.ministryId;

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [dataload, setDataLoad] = useState(true);
  const [viewMode, setViewMode] = useState("all");
  const [isAdd, setIsAdd] = useState(false);

  function calculateTotalAmount(data) {
    let total = 0;

    total += Object.values(data).reduce((sum, amount) => sum + amount, 0);

    return total;
  }

  function calculateTotalAmountByDepartment(data) {
    const totalsByDepartment = {};

    Object.entries(data).forEach(([department, budgets]) => {
      totalsByDepartment[department] = budgets.reduce(
        (total, budget) => total + budget.amount,
        0
      );
    });

    return totalsByDepartment;
  }

  useEffect(
    () => {
      async function fetchBudgets() {
        await axios
          .get(department.showBudgets + "/" + ministryId + "/" + activeTerm.id)
          .then((response) => {
            if (response.data.status === true) {
              setBudgets(response.data.data);
              setTotalUnits(response.data.totalUnits);
              setTotalAccountedUnits(response.data.totalAccountedUnits);
              setUnitsCountByDepartment(response.data.unitsCountByDepartment);
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
      fetchBudgets();

      if (activeTerm.budget_request) {
        if (activeTerm.budget_request.status !== "ACTIVE") {
          setNotificationDetails({
            msg:
              "Budget Request Rejected: " +
              activeTerm.budget_request.description,
            type: "danger",
          });
          setNotificationStatus(true);
        }
      }
    },
    // eslint-disable-next-line
    []
  );

  async function addBudgetRequest(e) {
    // setRequestLoading(true);
    e.preventDefault();
    await axios
      .post(budget_request.addBudgetRequest, {
        termId: activeTerm.id,
        ministryId: ministryId,
      })
      .then((response) => {
        if (response.data.status) {
          setNotificationDetails({
            msg: response.data.msg,
            type: "success",
          });
          setUserDetail({ ...userDetail, budget_request: response.data.data });
        } else {
          setNotificationDetails({
            msg: response.data.msg,
            type: "success",
          });
        }
        setNotificationStatus(true);
      })
      .catch((error) => {
        if (error.response) {
          setNotificationDetails({
            msg: error.response.data.msg,
            type: "danger",
          });
          setNotificationStatus(true);
        } else {
          console.log(error);
          setNotificationDetails({ msg: "Network Error!", type: "danger" });
          setNotificationStatus(true);
        }
      });
    // setRequestLoading(false);
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
                    <AddBudget
                      department_id={department_id}
                      setIsAdd={setIsAdd}
                    />
                  ) : (
                    <>
                      <Card>
                        <CardHeader>
                          <CardTitle className="pull-left" tag="h4">
                            Budgets
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
                                  placeholder="Search based on budget name"
                                  type="text"
                                  value={q}
                                  style={{ width: "100%" }}
                                  onChange={(e) => setQ(e.target.value)}
                                />
                              </Link>
                              {activeTerm.budget_request ? (
                                <>
                                  {activeTerm.budget_request.status !==
                                  "ACTIVE" ? (
                                    <Link style={{ marginRight: "15px" }}>
                                      <Button
                                        className="btn-fill"
                                        size="sm"
                                        style={{ width: "100%" }}
                                        color="primary"
                                        type="submit"
                                        onClick={() => {
                                          toggle();
                                        }}
                                      >
                                        <IoMdAddCircle size={20} /> Process
                                        Budget
                                      </Button>
                                    </Link>
                                  ) : null}
                                </>
                              ) : null}
                            </Row>
                          </div>
                        </CardHeader>{" "}
                      </Card>
                      <Row style={{ marginTop: "-15px" }}>
                        <Col>
                          <Card className="grow">
                            <CardBody>
                              <Row>
                                <Col>
                                  <CardTitle tag="h4">
                                    Units in Mininstry
                                  </CardTitle>
                                  <CardTitle tag="h5">
                                    Total: {totalUnits}
                                  </CardTitle>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col>
                          <Card className="grow">
                            <CardBody>
                              <Row>
                                <Col>
                                  <CardTitle tag="h4">
                                    Units Accounted For
                                  </CardTitle>
                                  <CardTitle tag="h5">
                                    Total: {totalAccountedUnits}
                                  </CardTitle>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col>
                          <Card className="grow">
                            <CardBody>
                              <Row>
                                <Col>
                                  <CardTitle tag="h4">Total Amount </CardTitle>
                                  <CardTitle tag="h5">
                                    Total:{" "}
                                    {calculateTotalAmount(
                                      calculateTotalAmountByDepartment(budgets)
                                    ).toLocaleString()}
                                  </CardTitle>
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Col>

                        {/* <Col>
                          <Card className="grow">
                            <CardBody>
                              <Row>
                                <Doughnut
                                  style={{}}
                                  data={{
                                    labels: ["Budgeted", "UnBudgeted"],
                                    datasets: [
                                      {
                                        id: 1,
                                        label: "",
                                        data: [5, 6],
                                      },
                                    ],
                                  }}
                                />
                              </Row>
                            </CardBody>
                          </Card>
                        </Col> */}
                      </Row>
                      {dataload === false ? (
                        <>
                          {Object.keys(budgets).length > 0 ? (
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
                                        <th>Total Amount</th>
                                        <th>Budgeted : Total Units</th>
                                        <th>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.keys(budgets).map((row, key) => {
                                        let allDepartments =
                                          calculateTotalAmountByDepartment(
                                            budgets
                                          );
                                        return (
                                          <>
                                            <tr key={key}>
                                              <td>{key + 1} </td>
                                              <td>
                                                <b>{row}</b>
                                                <br />
                                                {budgets[row].map((item, k) => {
                                                  return (
                                                    <Row>
                                                      <Col>
                                                        Unit: {item.Unit.name}
                                                      </Col>
                                                      <Col>
                                                        Amount:{" "}
                                                        {item.amount.toLocaleString()}
                                                      </Col>
                                                    </Row>
                                                  );
                                                })}
                                              </td>
                                              <td>
                                                {allDepartments[
                                                  row
                                                ].toLocaleString()}
                                              </td>
                                              <td>
                                                {budgets[row].length}:
                                                {unitsCountByDepartment[row]}{" "}
                                              </td>
                                              <td>
                                                <div>
                                                  <Button
                                                    onClick={() => {
                                                      setCurrentBudget(
                                                        budgets[row]
                                                      );
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
                  <font style={{ paddingLeft: "30px" }}>Back To Budgets </font>
                </Button>
              )}
            </Col>
          ) : null}

          {viewMode === "current" ? (
            <BudgetData
              currentBudget={currentBudget}
              setViewMode={setViewMode}
            />
          ) : null}
        </Row>
      </div>

      <Modal
        isOpen={modal}
        toggle={toggle}
        backdropClassName="modal-backdrop-dark"
        backdrop={true}
      >
        <ModalHeader toggle={toggle}>Process Budget</ModalHeader>
        <ModalBody style={{ textAlign: "center" }}>
          Total Amount:{" "}
          {calculateTotalAmount(
            calculateTotalAmountByDepartment(budgets)
          ).toLocaleString()}
          <br />
          Units In Mininstry: {totalUnits} <br />
          <>
            Units Accounted For: {totalAccountedUnits} <br />
          </>
          {totalUnits - totalAccountedUnits != 0 ? (
            <>
              There are <b>{totalUnits - totalAccountedUnits}</b>, Unaccounted
              Units, are You Sure, You Want to Continue. {totalUnits} <br />
            </>
          ) : (
            <>All Units Have Been Acounted For, Please Proceed.</>
          )}
          <Button
            className="btn-fill"
            color="primary"
            type="submit"
            onClick={(e) => addBudgetRequest(e)}
          >
            Process Budget
          </Button>
        </ModalBody>
        {/* <ModalFooter> */}

        {/* </ModalFooter> */}
      </Modal>
    </>
  );
}

export default Budget;
