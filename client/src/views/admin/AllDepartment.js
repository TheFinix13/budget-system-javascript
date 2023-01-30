import React, { useState, useEffect } from "react";
import axios from "axios";
import { department } from "../../data/api";

import Notifications from "components/Notification/Notification";
import { FiArrowLeft } from "react-icons/fi";
import { HiSearchCircle } from "react-icons/hi";
import empty from "../../assets/img/product.svg";

import { Link } from "react-router-dom";
import DepartmentData from "../ministry/DepartmentData";
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

function AllDepartment() {
  const [show_AllDepartment, setShow_AllDepartment] = useState([]);
  const [currentDepartment, setCurrentDepartment] = useState({});

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
        await axios.get(department.showAllDepartments).then((response) => {
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
                        Departments
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
                              placeholder="Search based on department name"
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
                                    <th>Ministry Its Under</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {show_AllDepartment.map((row, key) => (
                                    <tr key={key}>
                                      <td key={key}>{row.name} </td>
                                      <td key={key}>{row?.Ministry?.name} </td>
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
                              Nothing To Show Yet... Add Some Departments to The
                              System
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
    </>
  );
}

export default AllDepartment;
