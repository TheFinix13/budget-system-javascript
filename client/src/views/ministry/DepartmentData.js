import React, { useState, useEffect } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { MdDescription } from "react-icons/md";
import axios from "axios";
import Units from "./Unit";
import { useAuth } from "contexts/AuthContext";

import { Doughnut } from "react-chartjs-2";
import { expenditure, budget, department } from "data/api";
import { BiEdit } from "react-icons/bi";
import Notifications from "components/Notification/Notification";

// reactstrap components
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
  Form,
  FormGroup,
  Input,
} from "reactstrap";
import { Link } from "react-router-dom";

function DepartmentData({
  currentDepartment,
  setCurrentDepartment,
  setViewMode,
}) {
  const [HideDepartment, setHideDepartment] = useState(false);
  const [graphDetails, setGraphDetails] = useState({});
  const { activeTerm } = useAuth();
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({});

  const [expenditures, setExpenditures] = useState([]);
  const [unitExpenditures, setUnitExpenditures] = useState([]);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [type, setType] = useState("");

  function arrangeData(gd, isBudget) {
    let labels = [];
    let data = [];

    if (isBudget) {
      gd.map((item) => {
        labels.push(item.Unit.name);
        data.push(item.amount);
      });
    } else {
      labels = Object.keys(gd);
      data = Object.values(gd);
    }

    return {
      labels: labels,
      datasets: [
        {
          id: 1,
          label: "Buget : Expenditure",
          data: data,
          backgroundColor: [
            "rgba(255, 206, 86)",
            "rgba(75, 192, 192)",
            "rgba(153, 102, 255)",
            "rgba(255, 159, 64)",
          ],
          borderColor: [
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
        },
      ],
    };
  }

  useEffect(() => {
    async function fetchBudgetExpenditure() {
      await axios
        .get(
          expenditure.showBudgetVsExpenditure +
            "/" +
            activeTerm.id +
            "/" +
            currentDepartment.id
        )
        .then(async (response) => {
          if (response.data.status === true) {
            //getting unit budgets
            await axios
              .get(
                budget.showUnitBudgets +
                  "/" +
                  activeTerm.id +
                  "/" +
                  currentDepartment.id
              )
              .then((response1) => {
                if (response1.data.status === true) {
                  setGraphDetails({
                    bVSe: response.data.data,
                    unitBudgets: response1.data.data,
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
    async function fetchExpenditure() {
      await axios
        .get(
          expenditure.showExpenditureForDepartment +
            "/" +
            activeTerm.id +
            "/" +
            currentDepartment.id
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

    async function fetchUnitExpenditure() {
      await axios
        .get(
          expenditure.showUnitExpenses +
            "/" +
            activeTerm.id +
            "/" +
            currentDepartment.id
        )
        .then((response) => {
          if (response.data.status === true) {
            setUnitExpenditures(response.data.data);
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
    fetchExpenditure();
    fetchUnitExpenditure();
    fetchBudgetExpenditure();
  }, []);

  async function updateDepartment() {
    await axios
      .patch(
        department.updateDepartment + "/" + currentDepartment.id,
        currentDepartment
      )
      .then((res) => {
        if (res.data.status) {
          setNotificationDetails({
            msg: "Department Updated Successfully",
            type: "success",
            change: res.data.change,
          });
        } else {
          setNotificationDetails({
            msg: "Error Updating Department",
            type: "danger",
          });
        }
        setNotificationStatus(true);
      });
  }
  return (
    <>
      {notificationStatus ? (
        <Notifications details={notificationDetails} />
      ) : null}
      {HideDepartment ? null : (
        <Col md={12}>
          <Card>
            <CardHeader>
              <CardTitle className="pull-left" tag="h4">
                {currentDepartment.name}
              </CardTitle>
              <div className="pull-right" style={{ marginBottom: "20px" }}>
                <Row>
                  <Link>
                    <Button
                      className="btn-fill"
                      onClick={() => {
                        setType("unit");
                        toggle();
                      }}
                      style={{ marginRight: "15px" }}
                      color="primary"
                      type="submit"
                      size="sm"
                    >
                      {" "}
                      Units
                    </Button>
                  </Link>
                  <Link>
                    <Button
                      className="btn-fill"
                      onClick={() => {
                        setType("department");
                        toggle();
                      }}
                      style={{ marginRight: "15px" }}
                      color="primary"
                      type="submit"
                      size="sm"
                    >
                      <BiEdit size={20} /> Edit Department
                    </Button>
                  </Link>
                  <Link>
                    <Button
                      className="btn-fill"
                      onClick={() => {
                        setViewMode("all");
                      }}
                      style={{ marginRight: "15px" }}
                      color="primary"
                      type="submit"
                      size="sm"
                    >
                      <HiArrowNarrowLeft size={20} /> Back to Departments
                    </Button>
                  </Link>
                </Row>
              </div>
            </CardHeader>
            <CardBody>
              <MdDescription /> Description: {currentDepartment.description}
            </CardBody>
          </Card>
        </Col>
      )}
      <Col md={6}>
        <Card>
          <CardHeader>Budget : Expenditure Ratio</CardHeader>
          <CardBody>
            <Row>
              <Doughnut
                datasetIdKey="id"
                data={{
                  ...arrangeData(graphDetails.bVSe || {}),
                }}
              />
            </Row>
          </CardBody>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <CardHeader>Unit : Budget Ratio</CardHeader>
          <CardBody>
            <Row>
              <Doughnut
                datasetIdKey="id"
                data={{
                  ...arrangeData(graphDetails.unitBudgets || [], true),
                }}
              />
            </Row>
          </CardBody>
        </Card>
      </Col>

      <Col md={6}>
        <Card>
          <CardHeader>Individual Expenses</CardHeader>
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
                  <th>Description</th>
                  <th>Date Created</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenditures.map((item, key) => {
                  return (
                    <tr>
                      <td>{key + 1}</td>
                      <td>{item.Unit.name}</td>
                      <td>
                        {item.description} <br />
                      </td>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
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

      <Col md={6}>
        <Card>
          <CardHeader>Unit Expenses</CardHeader>
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
                  <th>Amount (NGN)</th>
                </tr>
              </thead>
              <tbody>
                {/* {JSON.stringify(currentBudget)} */}
                {Object.keys(unitExpenditures).map((item, key) => {
                  return (
                    <tr>
                      <td>{key + 1}</td>
                      <td>{item}</td>
                      <td>
                        {unitExpenditures[item].totalAmount.toLocaleString()}
                      </td>
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
        <ModalHeader toggle={toggle}>
          Viewing: {type.toLocaleUpperCase()}
        </ModalHeader>
        <ModalBody style={{ textAlign: "center" }}>
          {type === "unit" ? (
            <>
              <Units
                department_id={currentDepartment.id}
                setHideDepartment={setHideDepartment}
              />
            </>
          ) : null}

          {type === "department" ? (
            <>
              <Form
                onSubmit={(e) => {
                  updateDepartment(e);
                }}
              >
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label>Name of Department</label>
                      <Input
                        placeholder="Eg: Department of Finance"
                        type="text"
                        style={{ color: "#aaa" }}
                        defaultValue={currentDepartment.name}
                        onChange={(e) =>
                          setCurrentDepartment({
                            ...currentDepartment,
                            name: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Col>

                  <Col md="12">
                    <FormGroup>
                      <label>Description</label>
                      <Input
                        type="textarea"
                        placeholder="Short descrption about department..."
                        style={{ color: "#aaa" }}
                        defaultValue={currentDepartment.description}
                        onChange={(e) =>
                          setCurrentDepartment({
                            ...currentDepartment,
                            description: e.target.value,
                          })
                        }
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Button className="btn-fill" color="primary" type="submit">
                  Update Department
                </Button>
              </Form>
            </>
          ) : null}
        </ModalBody>
      </Modal>
    </>
  );
}

export default DepartmentData;
