import React from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { MdDescription } from "react-icons/md";

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

function BudgetData({ currentBudget, setViewMode }) {
  function arrangeData() {
    const labels = [];
    const data = [];
    currentBudget.map((item) => {
      labels.push(item.Unit.name);
      data.push(item.amount);
    });

    return {
      labels: labels,
      datasets: [
        {
          id: 1,
          label: "Unit Distribution",
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

  return (
    <>
      <Col md={12}>
        <Card>
          <CardHeader>
            <CardTitle className="pull-left" tag="h4">
              {currentBudget[0].data.department_name +
                ": " +
                currentBudget[0].data.sector}
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
                  <HiArrowNarrowLeft size={20} /> Back to Budgets
                </Button>
              </Row>
            </div>
          </CardHeader>
          <Col>
            <Row>
              <Col>
                <h5>
                  <MdDescription size={20} />
                  Purpose: {currentBudget[0].Department.description}
                </h5>
              </Col>
            </Row>
          </Col>
        </Card>
      </Col>

      <Col md={6}>
        <Card>
          <CardBody>
            <h5>Budget Unit Distribution</h5>
            <Doughnut
              datasetIdKey="id"
              data={{
                ...arrangeData(currentBudget),
              }}
            />
            {/* <Doughnut /> */}
          </CardBody>
        </Card>
      </Col>
      <Col md={6}>
        <Card>
          <CardHeader>Budget by Unit</CardHeader>
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
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* {JSON.stringify(currentBudget)} */}
                {currentBudget.map((item, key) => {
                  return (
                    <tr>
                      <td>{key + 1}</td>
                      <td>{item.Unit.name}</td>
                      <td>{item.Unit.number}</td>
                      <td> {item.amount}</td>

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
                  <th>Unit Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {/* {JSON.stringify(currentBudget)} */}
                {currentBudget.map((item, key) => {
                  return (
                    <tr>
                      <td>{key + 1}</td>
                      <td>
                        {item.Unit.name}
                        <br />
                        {item.Unit.number}
                      </td>
                      <td>
                        Description: {item.Unit.description} <br />
                        Notes: {item.data.notes} <br />
                      </td>
                      <td> {item.amount.toLocaleString()}</td>

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
    </>
  );
}

export default BudgetData;
