import React, { useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { AiFillCheckCircle } from "react-icons/ai";
import { GiCancel } from "react-icons/gi";
import axios from "axios";
import { budget_request } from "data/api";
import Notifications from "components/Notification/Notification";

// reactstrap components
import {
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button,
  Input,
} from "reactstrap";
import Budget from "views/ministry/Budget";
import { Link } from "react-router-dom";

function BudgetData({
  currentBudgetRequest,
  setCurrentBudgetRequest,
  setViewMode,
}) {
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  async function updateBudgetRequest(e, status) {
    e.preventDefault();
    await axios
      .put(budget_request.updateBudgetRequest + "/" + currentBudgetRequest.id, {
        status,
        description: currentBudgetRequest.description,
      })
      .then((response) => {
        if (response.data.status === true) {
          setNotificationDetails({
            msg: "Budget Request Updated Successfully.",
            type: "success",
          });
          setCurrentBudgetRequest({ ...currentBudgetRequest, status });
          setNotificationStatus(true);
          // setDataLoad(false);
        } else {
          setNotificationDetails({
            msg: "Error Updating Budget, Please Referesh The Page",
            type: "danger",
          });
          setNotificationStatus(true);
          // setDataLoad(false);
        }
      });
  }
  return (
    <>
      {notificationStatus ? (
        <Notifications details={notificationDetails} />
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="pull-left" tag="h4">
            Budget Request : {currentBudgetRequest.Ministry.name}
          </CardTitle>
          <div className="pull-right" style={{ marginBottom: "20px" }}>
            <Row>
              <Link style={{ paddingRight: "10px" }}>
                <Button
                  className="btn-fill"
                  onClick={() => setViewMode("all")}
                  style={{ width: "100%", marginRight: "15px" }}
                  color="primary"
                  type="submit"
                  size="sm"
                >
                  <HiArrowNarrowLeft size={20} /> Back to Budget Requests
                </Button>
              </Link>
            </Row>
          </div>
        </CardHeader>

        <Budget ministry_id={currentBudgetRequest.Ministry.id} />

        <Row style={{ padding: "15px" }}>
          <Col>
            <Button
              className="btn-fill"
              onClick={(e) => updateBudgetRequest(e, "ACTIVE")}
              style={{ width: "100%", marginRight: "15px" }}
              color="primary"
              type="submit"
              size="sm"
              disabled={currentBudgetRequest.status === "ACTIVE" ? true : false}
            >
              <AiFillCheckCircle size={20} /> Approve Budget
            </Button>
          </Col>
          <Col>
            <Button
              className="btn-fill"
              onClick={(e) => updateBudgetRequest(e, "rejected")}
              style={{ width: "100%", marginRight: "15px" }}
              color="danger"
              type="submit"
              size="sm"
            >
              <GiCancel size={20} /> Reject Budget
            </Button>
          </Col>
        </Row>
        <Col>
          <Input
            placeholder="Write a Description."
            type="textarea"
            style={{ width: "100%" }}
            defaultValue={currentBudgetRequest.description}
            onChange={(e) =>
              setCurrentBudgetRequest({
                ...currentBudgetRequest,
                description: e.target.value,
              })
            }
          />
        </Col>
      </Card>
    </>
  );
}

export default BudgetData;
