import React, { useState, useEffect } from "react";
import axios from "axios";
import { ministry } from "../../data/api";
import Notifications from "components/Notification/Notification";
import { FiArrowLeft, FiGrid } from "react-icons/fi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import empty from "../../assets/img/product.svg";
import { HiSearchCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import MinistryData from "./MinistryData";
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
  Input,
} from "reactstrap";

function Ministries() {
  //let symbol = "₦";
  const [ministries, setMinistries] = useState([]);
  const [currentMinistry, setCurrentMinistry] = useState({});
  const [orientation, setOrientation] = useState("grid");

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  const [dataload, setDataLoad] = useState(true);
  const [viewMode, setViewMode] = useState("all");

  useEffect(
    () => {
      async function fetchMinistries() {
        await axios.get(ministry.showMinistries).then((response) => {
          if (response.data.status === true) {
            setMinistries(response.data.data);
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
      fetchMinistries();
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
                        Ministries
                      </CardTitle>
                      <div
                        className="pull-right"
                        style={{ marginBottom: "20px" }}
                      >
                        <Row>
                          <HiSearchCircle
                            size={30}
                            style={{ marginRight: "7px", marginTop: "10px" }}
                          />
                          <Link
                            style={{ paddingTop: "5px", paddingRight: "10px" }}
                          >
                            <Input
                              placeholder="Search based on ministry name"
                              type="text"
                              value={q}
                              style={{ width: "100%" }}
                              onChange={(e) => setQ(e.target.value)}
                            />
                          </Link>

                          <Link to="/admin/addministry">
                            <Button
                              className="btn-fill"
                              style={{ width: "100%" }}
                              color="primary"
                              type="submit"
                              size="sm"
                            >
                              <IoMdAddCircle size={20} /> Add Ministry
                            </Button>
                          </Link>

                          <div style={{ padding: "7px" }}>
                            <FiGrid
                              style={{ marginRight: "15px", cursor: "pointer" }}
                              size={23}
                              onClick={() => {
                                setOrientation("grid");
                              }}
                            />
                            <AiOutlineUnorderedList
                              style={{ marginRight: "15px", cursor: "pointer" }}
                              size={23}
                              onClick={() => {
                                setOrientation("list");
                              }}
                            />
                          </div>
                        </Row>
                      </div>
                    </CardHeader>
                  </Card>

                  {dataload === false ? (
                    <>
                      {ministries.length > 0 ? (
                        <>
                          {orientation === "grid" ? (
                            <Row>
                              {ministries.map((row, key) => (
                                <Col
                                  md={3}
                                  style={{ cursor: "pointer" }}
                                  key={key}
                                  onClick={() => {
                                    setCurrentMinistry(row);
                                    setViewMode("current");
                                  }}
                                >
                                  <Card className="grow">
                                    <CardBody>
                                      <Row>
                                        <CardHeader>
                                          <CardTitle tag="h4">
                                            <b>{row.name}</b>
                                          </CardTitle>
                                          <CardTitle tag="h5">
                                            Total Departments:{" "}
                                            {row.departmentCount}
                                          </CardTitle>
                                          <CardTitle tag="h5">
                                            Total Units: {row.unitCount}
                                          </CardTitle>
                                        </CardHeader>
                                      </Row>
                                    </CardBody>
                                  </Card>
                                </Col>
                              ))}
                            </Row>
                          ) : (
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
                                      <th>Sector</th>
                                      <th>Departments</th>
                                      <th>Units</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {ministries.map((row, key) => (
                                      <tr key={key}>
                                        <td key={key}>{row.name} </td>
                                        <td key={key}>{row.sector} </td>
                                        <td key={key}>{row.departmentCount}</td>
                                        <td key={key}>{row.unitCount} </td>
                                        <td>
                                          <div>
                                            <Button
                                              onClick={() => {
                                                setCurrentMinistry(row);
                                                setViewMode("current");
                                              }}
                                              className="btn-fill"
                                              style={{ marginBottom: "5px" }}
                                              color="primary"
                                              type="submit"
                                            >
                                              Show
                                            </Button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </CardBody>
                            </Card>
                          )}
                        </>
                      ) : (
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
                            Nothing To Show Yet... Add Some Ministries to The
                            System
                          </CardTitle>
                        </div>
                      )}
                    </>
                  ) : (
                    "Loading"
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
                  <font style={{ paddingLeft: "30px" }}>
                    Back To Ministries{" "}
                  </font>
                </Button>
              )}
            </Col>
          ) : null}

          {viewMode === "current" ? (
            <MinistryData
              currentMinistry={currentMinistry}
              setCurrentMinistry={setCurrentMinistry}
              setViewMode={setViewMode}
            />
          ) : null}
        </Row>
      </div>
    </>
  );
}

export default Ministries;
