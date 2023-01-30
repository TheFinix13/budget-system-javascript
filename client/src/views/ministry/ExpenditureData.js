import React, { useState, useEffect } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { MdDescription } from "react-icons/md";
import { IoLocationSharp } from "react-icons/io";
import axios from "axios";
import { useAuth } from "contexts/AuthContext";
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
} from "reactstrap";
import { Doughnut } from "react-chartjs-2";
import { expenditure } from "data/api";
import Notifications from "components/Notification/Notification";

function ExpenditureData({ currentExpenditure, setViewMode }) {
  const [HideExpenditure, setHideExpenditure] = useState(false);
  const [expenditures, setExpenditures] = useState([]);
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({});
  const [graphDetails, setGraphDetails] = useState({});
  const { userDetail, activeTerm } = useAuth();

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

  useEffect(
    () => {
      async function fetchExpenditure() {
        await axios
          .get(
            expenditure.showExpenditureForDepartment +
              "/" +
              activeTerm.id +
              "/" +
              currentExpenditure.department_id
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

      async function fetchBudgetExpenditure() {
        await axios
          .get(
            expenditure.showBudgetVsExpenditure +
              "/" +
              activeTerm.id +
              "/" +
              userDetail.ministryId +
              "/" +
              currentExpenditure.department_id
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
      fetchExpenditure();
      fetchBudgetExpenditure();
    },
    // eslint-disable-next-line
    []
  );

  return (
    <>
      {notificationStatus ? (
        <Notifications details={notificationDetails} />
      ) : null}
      {HideExpenditure ? null : (
        <Col md={12}>
          <Card>
            <CardHeader>
              <CardTitle className="pull-left" tag="h4">
                Expenditure: {currentExpenditure.department_name}
              </CardTitle>
              <div className="pull-right" style={{ marginBottom: "20px" }}>
                <Row>
                  <Button
                    className="btn-fill"
                    onClick={() => setViewMode("all")}
                    style={{ width: "100%", marginRight: "15px" }}
                    color="primary"
                    type="submit"
                    size="sm"
                  >
                    <HiArrowNarrowLeft size={20} /> Back to Expenditure
                  </Button>
                </Row>
              </div>
            </CardHeader>
          </Card>
        </Col>
      )}
      <Col>
        <Card className="grow">
          {" "}
          <CardHeader>Budget : Expenditure Statistics</CardHeader>
          <CardBody>
            <Row>
              <Doughnut
                datasetIdKey="id"
                data={{
                  ...arrangeData(),
                }}
              />
            </Row>
          </CardBody>
        </Card>
      </Col>

      <Col md={6}>
        <Card>
          <CardHeader>Expenses by Unit</CardHeader>
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
                {currentExpenditure.units.map((item, key) => {
                  return (
                    <tr>
                      <td>{key + 1}</td>
                      <td>{Object.keys(item)[0]}</td>
                      <td>{Object.values(item)[0].toLocaleString()}</td>
                      {/* <td> {item.amount}</td> */}

                      <br />

                      {/* <Col>Unit: {item.Unit.name}</Col>
                        <Col>Amount: {item.amount.toLocaleString()}</Col> */}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
      <Col md={12}>
        <Card>
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
    </>
  );
}

export default ExpenditureData;
