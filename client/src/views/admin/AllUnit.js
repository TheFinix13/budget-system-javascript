import React, { useState, useEffect } from "react";
import axios from "axios";
import { unit } from "../../data/api";
import Notifications from "components/Notification/Notification";
import { FiArrowLeft } from "react-icons/fi";

import empty from "../../assets/img/product.svg";
import { HiSearchCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import UnitData from "../ministry/UnitData";
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

function AllUnit() {
  const [showAllUnit, setShowAllUnit] = useState([]);
  const [currentUnit, setCurrentUnit] = useState({});

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  const [dataload, setDataLoad] = useState(true);
  const [viewMode, setViewMode] = useState("all");

  useEffect(
    () => {
      async function fetchAllUnits() {
        await axios.get(unit.showAllUnits).then((response) => {
          if (response.data.status === true) {
            setShowAllUnit(response.data.data);
            setDataLoad(false);
          } else {
            setNotificationDetails({
              msg: "Error Loading Units, Please Referesh The Page",
              type: "danger",
            });
            setNotificationStatus(true);
            setDataLoad(false);
          }
        });
      }
      fetchAllUnits();
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
                        Units
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
                              placeholder="Search based on unit name"
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
                      {showAllUnit.length > 0 ? (
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
                                    <th>Unit Name</th>
                                    <th>Department Formed From</th>
                                    <th>Ministry Its Under</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {showAllUnit.map((row, key) => (
                                    <tr key={key}>
                                      <td key={key}>{row.name} </td>
                                      <td key={key}>{row?.Department?.name}</td>
                                      <td key={key}>
                                        {row?.Department?.Ministry?.name}{" "}
                                      </td>
                                      <td key={key}>{row.description} </td>
                                      <td>
                                        <Button
                                          onClick={() => {
                                            setCurrentUnit(row);
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
                              Nothing To Show Yet... Add Some Units to The
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
            <UnitData currentUnit={currentUnit} setViewMode={setViewMode} />
          ) : null}
        </Row>
      </div>
    </>
  );
}

export default AllUnit;
