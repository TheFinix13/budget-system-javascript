import React, { useState, useEffect } from "react";
import { HiArrowNarrowLeft, HiPlus } from "react-icons/hi";
import { MdDescription } from "react-icons/md";
import axios from "axios";
import { useAuth } from "contexts/AuthContext";
import Notifications from "components/Notification/Notification";
import { budget, expenditure } from "data/api";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Button,
  Form,
  Input,
  FormGroup,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";

function UnitData({ currentUnit, setViewMode }) {
  const [budgetData, setBudgetData] = useState({});
  const [currentExpenditure, setCurrentExpenditure] = useState({});
  const [mode, setMode] = useState("add");
  const { activeTerm } = useAuth();
  const [graphDetails, setGraphDetails] = useState({});
  const [expenditures, setExpenditures] = useState([]);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });

  function arrangeData() {
    const labels = Object.keys(graphDetails);
    const data = Object.values(graphDetails);

    return {
      labels: labels,
      datasets: [
        {
          id: 1,
          label: "Buget : Expenditure",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132)",
            "rgba(54, 162, 235)",
            "rgba(255, 206, 86)",
            "rgba(75, 192, 192)",
            "rgba(153, 102, 255)",
            "rgba(255, 159, 64)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
        },
      ],
    };
  }

  async function addBudget(e) {
    // setRequestLoading(true);
    e.preventDefault();
    let BData = {
      ...budgetData,
      termId: activeTerm.id,
      unitId: currentUnit.id,
      departmentId: currentUnit.Department.id,
      data: {
        ...budgetData.data,
        ministry_name: currentUnit.Department.Ministry.name,
        department_name: currentUnit.Department.name,
        sector: currentUnit.Department.Ministry.sector,
        description: currentUnit.description,
      },
    };
    await axios
      .post(budget.addBudget, BData)
      .then((response) => {
        if (response.data.status) {
          setNotificationDetails({
            msg: "Budget Request Created Successfully",
            type: "success",
          });
          //   setUnitData({});
        } else {
          setNotificationDetails({
            msg: "Error Creating Units...",
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
          setNotificationDetails({ msg: "Network Error!", type: "danger" });
          setNotificationStatus(true);
        }
      });
    // setRequestLoading(false);
  }

  async function addExpense(e) {
    // setRequestLoading(true);
    e.preventDefault();
    let data = {
      unitId: currentUnit.id,
      termId: activeTerm.id,
      departmentId: currentUnit.departmentId,
      budgetRequestId: activeTerm.budget_request.id,
      ...currentExpenditure,
    };
    await axios
      .post(expenditure.addExpenditure, data)
      .then((response) => {
        if (response.data.status) {
          setNotificationDetails({
            msg: "Expense Created Successfully",
            type: "success",
          });
          fetchBudgetExpenditure();
          //   setUnitData({});
        } else {
          setNotificationDetails({
            msg: "Error Creating Expense...",
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
          setNotificationDetails({ msg: "Network Error!", type: "danger" });
          setNotificationStatus(true);
        }
      });
    // setRequestLoading(false);
  }

  async function updateBudget(e) {
    // setRequestLoading(true);
    e.preventDefault();
    let BData = {
      ...budgetData,
      data: {
        ...budgetData.data,
        ministry_name: currentUnit.Department.Ministry.name,
        department_name: currentUnit.Department.name,
        sector: currentUnit.Department.Ministry.sector,
        description: currentUnit.description,
      },
    };
    await axios
      .put(budget.updateBudget + "/" + BData.id, BData)
      .then((response) => {
        if (response.data.status) {
          setNotificationDetails({
            msg: "Budget Updated Successfully",
            type: "success",
          });
          //   setUnitData({});
        } else {
          setNotificationDetails({
            msg: "Error Updating Bugdet...",
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
          setNotificationDetails({ msg: "Network Error!", type: "danger" });
          setNotificationStatus(true);
        }
      });
    // setRequestLoading(false);
  }
  async function fetchBudgetExpenditure() {
    await axios
      .get(
        expenditure.showBudgetVsExpenditureUnit +
          "/" +
          activeTerm.id +
          "/" +
          currentUnit.id
      )
      .then((response) => {
        if (response.data.status === true) {
          setGraphDetails(response.data.data);
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
  useEffect(
    () => {
      async function fetchBudget() {
        await axios
          .get(
            budget.showBudgetById + "/" + currentUnit.id + "/" + activeTerm.id
          )
          .then((response) => {
            if (response.data.status === true) {
              setBudgetData(response.data.data);
              if (Object.keys(response.data.data || {}).length > 0) {
                setMode("view");
              }
            } else {
              setNotificationDetails({
                msg: "Error Loading Budget, Please Referesh The Page",
                type: "danger",
              });
              setNotificationStatus(true);
            }
          });
      }
      async function fetchExpenditure() {
        console.log(currentUnit.id);
        await axios
          .get(
            expenditure.showExpenditureForDepartment +
              "/" +
              activeTerm.id +
              "/" +
              currentUnit.id
          )
          .then((response) => {
            if (response.data.status === true) {
              setExpenditures(response.data.data);
              // setDataLoad(false);
            } else {
              setNotificationDetails({
                msg: "Error Loading Expenditures Please Referesh The Page",
                type: "danger",
              });
              setNotificationStatus(true);
              // setDataLoad(false);
            }
          });
      }

      fetchBudget();
      fetchBudgetExpenditure();
      fetchExpenditure();
    },
    // eslint-disable-next-line
    []
  );

  return (
    <>
      {notificationStatus ? (
        <Notifications details={notificationDetails} />
      ) : null}

      <Col md={12}>
        <Card>
          <CardHeader>
            <CardTitle className="pull-left" tag="h4">
              {currentUnit.name}
            </CardTitle>
            <div className="pull-right" style={{ marginBottom: "20px" }}>
              <Row>
                {activeTerm.budget_request ? (
                  <>
                    {activeTerm.budget_request.status === "ACTIVE" ? (
                      <Link>
                        <Button
                          className="btn-fill"
                          onClick={() => toggle()}
                          style={{ marginRight: "15px" }}
                          color="primary"
                          type="submit"
                          size="sm"
                        >
                          <HiPlus size={20} /> Add Expense
                        </Button>
                      </Link>
                    ) : null}
                  </>
                ) : null}
                <Link>
                  <Button
                    className="btn-fill"
                    onClick={() => setViewMode("all")}
                    style={{ marginRight: "15px" }}
                    color="primary"
                    type="submit"
                    size="sm"
                  >
                    <HiArrowNarrowLeft size={20} /> Back to Units
                  </Button>
                </Link>
              </Row>
            </div>
          </CardHeader>
          <Col>
            <Row>
              <Col>
                <h5>
                  <MdDescription size={20} />
                  Purpose: {currentUnit.description}
                </h5>
              </Col>
            </Row>
          </Col>
        </Card>

        <Card>
          <CardBody>
            {mode === "view" ? (
              <>
                <Row>
                  <Col>
                    <h5>Budget Request</h5>
                    <Col> Status: {budgetData?.status}</Col>
                    <Col> Name: {currentUnit.name}</Col>
                    <Col>
                      {" "}
                      Sector Name: {currentUnit.Department.Ministry.sector}
                    </Col>
                    <Col> Amount: {budgetData?.amount}</Col>
                    <Col>Department Name: {currentUnit.Department.name} </Col>
                    <Col>
                      Ministry Name: {currentUnit.Department.Ministry.name}
                    </Col>
                    <Col> Description: {currentUnit.description} </Col>
                    <Col> Notes: {budgetData?.data?.notes}</Col>
                  </Col>
                  <Col md={6}>
                    <h5 style={{ textAlign: "center" }}>
                      Budget : Expenditure Statistics
                    </h5>
                    <Doughnut
                      datasetIdKey="id"
                      data={{
                        ...arrangeData(),
                      }}
                    />
                  </Col>
                </Row>
                <hr />
                {activeTerm.budget_request.status}
                {/* if budget request isnt approved or if its null */}
                {activeTerm.budget_request ? (
                  <>
                    {activeTerm.budget_request.status !== "ACTIVE" ? (
                      <>
                        <Button
                          className="btn-fill"
                          color="primary"
                          size={"sm"}
                          onClick={() => setMode("edit")}
                        >
                          Edit Mode: Unit Budget
                        </Button>
                      </>
                    ) : null}
                  </>
                ) : (
                  <Button
                    className="btn-fill"
                    color="primary"
                    size={"sm"}
                    onClick={() => setMode("edit")}
                  >
                    Edit Mode: Unit Budget
                  </Button>
                )}
              </>
            ) : null}

            {mode === "add" ? (
              <Form
                onSubmit={(e) => {
                  addBudget(e);
                }}
              >
                <Row>
                  <Col md="4" className="pr-md-1">
                    <FormGroup>
                      <label>Amount</label>
                      <Input
                        placeholder="Amount requested"
                        type="text"
                        onChange={(e) =>
                          setBudgetData({
                            ...budgetData,
                            amount: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4" className="px-md-1">
                    <FormGroup>
                      <label>Unit</label>
                      <Input
                        type="text"
                        defaultValue={currentUnit.name}
                        disabled={true}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4" className="pl-md-1">
                    <FormGroup>
                      <label>Term</label>
                      <Input
                        type="text"
                        defaultValue={activeTerm.name}
                        disabled={true}
                      />
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <label>Description/Notes: </label>
                      <br />
                      <Input
                        type="textarea"
                        placeholder="Short descrption about unit..."
                        onChange={(e) =>
                          setBudgetData({
                            ...budgetData,
                            data: { notes: e.target.value },
                          })
                        }
                      />
                      Name: {currentUnit.name} <br />
                      Description: {currentUnit.description} <br />
                      Unit ID: {currentUnit.number} <br />
                      Department Name: {currentUnit.Department.name} <br />
                      Ministry Name: {currentUnit.Department.Ministry.name}{" "}
                      <br />
                      Sector Name: {currentUnit.Department.Ministry.sector}{" "}
                      <br />
                    </FormGroup>
                  </Col>
                </Row>

                <Button className="btn-fill" color="primary" type="submit">
                  Submit Unit Budget
                </Button>
              </Form>
            ) : null}

            {mode === "edit" ? (
              <Form
                onSubmit={(e) => {
                  updateBudget(e);
                }}
              >
                <Row>
                  <Col md="4" className="pr-md-1">
                    <FormGroup>
                      <label>Amount</label>
                      <Input
                        placeholder="Amount requested"
                        type="text"
                        defaultValue={budgetData.amount}
                        onChange={(e) =>
                          setBudgetData({
                            ...budgetData,
                            amount: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4" className="px-md-1">
                    <FormGroup>
                      <label>Unit</label>
                      <Input
                        type="text"
                        defaultValue={currentUnit.name}
                        disabled={true}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4" className="pl-md-1">
                    <FormGroup>
                      <label>Term</label>
                      <Input
                        type="text"
                        defaultValue={activeTerm.name}
                        disabled={true}
                      />
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <label>Description/Notes: </label>
                      <br />
                      <Input
                        type="textarea"
                        placeholder="Short descrption about unit..."
                        defaultValue={budgetData.data.notes}
                        onChange={(e) =>
                          setBudgetData({
                            ...budgetData,
                            data: { notes: e.target.value },
                          })
                        }
                      />
                      Name: {currentUnit.name} <br />
                      Description: {currentUnit.description} <br />
                      Unit ID: {currentUnit.number} <br />
                      Department Name: {currentUnit.Department.name} <br />
                      Ministry Name: {currentUnit.Department.Ministry.name}{" "}
                      <br />
                      Sector Name: {currentUnit.Department.Ministry.sector}{" "}
                      <br />
                    </FormGroup>
                  </Col>
                </Row>

                <Button className="btn-fill" color="primary" type="submit">
                  Update Unit Budget
                </Button>
              </Form>
            ) : null}
          </CardBody>
        </Card>
      </Col>
      <Col md={12}>
        <Card>
          <CardHeader tag="h4">Expenditure for Unit.</CardHeader>
          <CardBody>
            <Table
              className="tablesorter"
              responsive
              style={{ overflow: "unset" }}
            >
              <thead className="text-primary">
                <tr>
                  <th>SN</th>
                  <th>Unit Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map((item, key) => {
                  return (
                    <tr>
                      <td>{key + 1}</td>
                      <td>
                        {item.description} <br />
                      </td>
                      <td> {item.amount.toLocaleString()}</td>

                      <br />
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>

      <Modal
        isOpen={modal}
        toggle={toggle}
        backdrop={true}
        backdropClassName="modal-backdrop-dark"
        size="lg"
      >
        <ModalHeader toggle={toggle}>Add Expense</ModalHeader>
        <ModalBody style={{ textAlign: "center" }}>
          <Form onSubmit={(e) => addExpense(e)}>
            <Row>
              <Col md="6" className="pr-md-1">
                <FormGroup>
                  <label>Amount</label>
                  <Input
                    style={{ color: "#aaa" }}
                    placeholder="Eg: 100000"
                    type="number"
                    onChange={(e) =>
                      setCurrentExpenditure({
                        ...currentExpenditure,
                        amount: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </Col>

              <Col md="6" className="pr-md-1">
                <FormGroup>
                  <label>Date of Expense</label>
                  <Input
                    style={{ color: "#aaa" }}
                    type="date"
                    onChange={(e) =>
                      setCurrentExpenditure({
                        ...currentExpenditure,
                        date: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </Col>

              <Col md="12">
                <FormGroup>
                  <label>Description</label>
                  <Input
                    style={{ color: "#aaa" }}
                    type="textarea"
                    placeholder="Short descrption about expense..."
                    onChange={(e) =>
                      setCurrentExpenditure({
                        ...currentExpenditure,
                        description: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>

            <Button className="btn-fill" color="primary" type="submit">
              Add Expense
            </Button>
          </Form>
        </ModalBody>
        {/* <ModalFooter> */}

        {/* </ModalFooter> */}
      </Modal>
    </>
  );
}

export default UnitData;
