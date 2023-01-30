import React, { useState, useEffect } from "react";
import axios from "axios";
import { budget_request } from "../../data/api";
import Notifications from "components/Notification/Notification";
import { FiArrowLeft } from "react-icons/fi";

import empty from "../../assets/img/product.svg";
import { HiSearchCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import BudgetRequestData from "./BudgetRequestData";
import { useAuth } from "contexts/AuthContext";
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

function AllBudgetRequest() {
  const { activeTerm } = useAuth();
  const [showAllBudgetRequest, setShowAllBudgetRequest] = useState([]);
  const [currentBudgetRequest, setCurrentBudgetRequest] = useState({});

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  const [dataload, setDataLoad] = useState(true);
  const [viewMode, setViewMode] = useState("all");

  useEffect(
    () => {
      async function fetchAllBudgetRequests() {
        await axios
          .get(budget_request.showBudgetRequests + "/" + activeTerm.id)
          .then((response) => {
            if (response.data.status === true) {
              setShowAllBudgetRequest(response.data.data);
              setDataLoad(false);
            } else {
              setNotificationDetails({
                msg: "Error Loading BudgetRequests, Please Referesh The Page",
                type: "danger",
              });
              setNotificationStatus(true);
              setDataLoad(false);
            }
          });
      }
      fetchAllBudgetRequests();
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
            <Col md="12">
              {loading === true ? (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="pull-left" tag="h4">
                        Budget Requests
                      </CardTitle>
                      <div
                        className="pull-right"
                        style={{ marginBottom: "20px" }}
                      >
                        <Row>
                          <HiSearchCircle
                            size={30}
                            style={{ marginLeft: "10px", marginTop: "12px" }}
                          />
                          <Link
                            style={{ paddingTop: "10px", paddingRight: "10px" }}
                          >
                            <Input
                              placeholder="Search based on BudgetRequest name"
                              type="text"
                              value={q}
                              style={{ width: "100%" }}
                              onChange={(e) => setQ(e.target.value)}
                            />
                          </Link>
                        </Row>
                      </div>
                    </CardHeader>
                  </Card>

                  {dataload === false ? (
                    <>
                      {showAllBudgetRequest.length > 0 ? (
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
                                    <th>Ministry Name</th>
                                    <th>Total Amount</th>
                                    <th>Created At</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {showAllBudgetRequest.map((row, key) => (
                                    <tr key={key}>
                                      <td key={key}>{row?.Ministry?.name} </td>
                                      <td key={key}>{row?.total_amount}</td>
                                      <td key={key}>
                                        {new Date(
                                          row?.createdAt
                                        ).toLocaleDateString()}{" "}
                                      </td>
                                      <td key={key}>{row.status} </td>
                                      <td>
                                        <Button
                                          onClick={() => {
                                            setCurrentBudgetRequest(row);
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
                              Nothing To Show Yet... Add Some BudgetRequests to
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
            <BudgetRequestData
              currentBudgetRequest={currentBudgetRequest}
              setCurrentBudgetRequest={setCurrentBudgetRequest}
              setViewMode={setViewMode}
            />
          ) : null}
        </Row>
      </div>
    </>
  );
}

export default AllBudgetRequest;
