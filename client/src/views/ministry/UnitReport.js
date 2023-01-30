import React, { useState, useEffect } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { MdDescription } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import axios from "axios";
import { useAuth } from "contexts/AuthContext";
import Notifications from "components/Notification/Notification";
import { budget, unit, expenditure } from "data/api";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Form,
  Input,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { Doughnut } from "react-chartjs-2";

function UnitReport({ currentUnit, setCurrentUnit, setViewMode }) {
  const [budgetData, setBudgetData] = useState({});
  const { activeTerm } = useAuth();

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [graphDetails, setGraphDetails] = useState({});

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

  async function updateUnit(e) {
    // setRequestLoading(true);
    e.preventDefault();
    await axios
      .put(unit.updateUnit + "/" + currentUnit.id, currentUnit)
      .then((response) => {
        if (response.data.status) {
          setNotificationDetails({
            msg: "Unit Updated Successfully",
            type: "success",
          });
          //   setUnitReport({});
        } else {
          setNotificationDetails({
            msg: "Error Updating Unit...",
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
            } else {
              setNotificationDetails({
                msg: "Error Loading Budget, Please Referesh The Page",
                type: "danger",
              });
              setNotificationStatus(true);
            }
          });
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
      fetchBudgetExpenditure();
      fetchBudget();
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
                <Link style={{ marginRight: "15px" }}>
                  <Button
                    className="btn-fill"
                    onClick={() => toggle()}
                    style={{ width: "100%", marginRight: "15px" }}
                    color="primary"
                    type="submit"
                    size="sm"
                  >
                    <AiFillEdit size={20} /> Edit Unit
                  </Button>
                </Link>

                <Link
                  style={{
                    paddingRight: "10px",
                  }}
                >
                  <Button
                    className="btn-fill"
                    onClick={() => setViewMode("all")}
                    style={{ width: "100%", marginRight: "15px" }}
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
      </Col>

      <Col md={6}>
        <Card>
          <h5 style={{ textAlign: "center" }}>
            Budget : Expenditure Statistics
          </h5>
          <Doughnut
            datasetIdKey="id"
            data={{
              ...arrangeData(),
            }}
          />
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <CardHeader>Expenditure to Budget Ratio</CardHeader>
          <CardBody>
            {" "}
            {activeTerm.name}: {activeTerm.year},<br />
            NGN: {(budgetData.amount || 0).toLocaleString()}
            <br />
            Notes: {budgetData?.data?.notes}
          </CardBody>
        </Card>
      </Col>

      <Modal
        isOpen={modal}
        backdropClassName="modal-backdrop-dark"
        toggle={toggle}
        backdrop={true}
      >
        <ModalHeader toggle={toggle}>Edit Unit</ModalHeader>
        <ModalBody style={{ textAlign: "center" }}>
          <Form
            onSubmit={(e) => {
              updateUnit(e);
            }}
          >
            <Row>
              <Col md="6" className="pr-md-1">
                <FormGroup>
                  <label>Name of Unit</label>
                  <Input
                    style={{ color: "#aaa" }}
                    placeholder="Eg: Unit for Chairs"
                    type="text"
                    defaultValue={currentUnit.name}
                    onChange={(e) =>
                      setCurrentUnit({ ...currentUnit, name: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>

              <Col md="6" className="pr-md-1">
                <FormGroup>
                  <label>Unit Number</label>
                  <Input
                    style={{ color: "#aaa" }}
                    placeholder="Eg: U101"
                    type="text"
                    defaultValue={currentUnit.number}
                    onChange={(e) =>
                      setCurrentUnit({
                        ...currentUnit,
                        number: e.target.value,
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
                    placeholder="Short descrption about unit..."
                    defaultValue={currentUnit.description}
                    onChange={(e) =>
                      setCurrentUnit({
                        ...currentUnit,
                        description: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>

            <Button className="btn-fill" color="primary" type="submit">
              Update Unit
            </Button>
          </Form>
        </ModalBody>
        {/* <ModalFooter> */}

        {/* </ModalFooter> */}
      </Modal>
    </>
  );
}

export default UnitReport;
