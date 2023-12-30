import React, { useState, useEffect } from "react";
import axios from "axios";
import { unit } from "../../data/api";

import { FaTrashAlt } from "react-icons/fa";
import Notifications from "components/Notification/Notification";
import { FiArrowLeft, FiGrid } from "react-icons/fi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import empty from "../../assets/img/product.svg";

import { HiSearchCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import UnitData from "../ministry/UnitData";
import AddUnit from "./AddUnit";

// import DepartmentData from "./DepartmentData";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  CardText,
  Input,
  FormGroup,
} from "reactstrap";

function Unit({ department_id, setHideDepartment }) {
  const [units, setUnits] = useState([]);
  const [currentUnit, setCurrentUnit] = useState({});

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  const [dataload, setDataLoad] = useState(true);
  const [viewMode, setViewMode] = useState("all");
  const [isAdd, setIsAdd] = useState(false);

  useEffect(
    () => {
      async function fetchUnits() {
        await axios
          .get(unit.showUnits + "/" + department_id)
          .then((response) => {
            if (response.data.status === true) {
              setUnits(response.data.data);
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
      fetchUnits();
    },
    // eslint-disable-next-line
    []
  );

  async function updateUnit() {
    await axios.patch(unit.updateUnit, currentUnit).then((res) => {
      if (res.data.status) {
        setNotificationDetails({
          msg: "Unit Updated Successfully",
          type: "success",
          change: res.data.change,
        });
      } else {
        setNotificationDetails({ msg: "Error Updating Unit", type: "danger" });
      }
      setNotificationStatus(true);
    });
  }

  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");

  return (
    <>
      {notificationStatus ? (
        <Notifications details={notificationDetails} />
      ) : null}
      <Row>
        {viewMode === "all" ? (
          <Col>
            {loading === true ? (
              <>
                {isAdd ? (
                  <AddUnit department_id={department_id} setIsAdd={setIsAdd} />
                ) : (
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
                              style={{
                                paddingTop: "10px",
                                paddingRight: "10px",
                              }}
                            >
                              <Input
                                placeholder="Search based on unit name"
                                type="text"
                                value={q}
                                style={{ width: "100%" }}
                                onChange={(e) => setQ(e.target.value)}
                              />
                            </Link>

                            <Link style={{ marginRight: "15px" }}>
                              <Button
                                className="btn-fill"
                                size="md"
                                style={{ width: "100%" }}
                                color="primary"
                                type="submit"
                                onClick={() => {
                                  setIsAdd(true);
                                }}
                              >
                                <IoMdAddCircle size={20} /> Add Units
                              </Button>
                            </Link>
                          </Row>
                        </div>
                      </CardHeader>
                    </Card>

                    {dataload === false ? (
                      <>
                        {units.length > 0 ? (
                          <>
                            <Card>
                              <hr
                                style={{
                                  backgroundColor: "#aaa",
                                  marginRight: "2%",
                                  marginLeft: "2%",
                                  marginTop: "-15px",
                                }}
                              />
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
                                      <th>Unit Description</th>
                                      <th>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {units.map((row, key) => (
                                      <tr key={key}>
                                        <td key={key}>{key + 1} </td>
                                        <td key={key}>{row.name} </td>
                                        <td key={key}>{row.number} </td>
                                        <td key={key}>{row.description} </td>
                                        <td>
                                          <div>
                                            <Button
                                              onClick={() => {
                                                setCurrentUnit(row);
                                                setViewMode("current");
                                                setHideDepartment(true);
                                              }}
                                              className="btn-fill"
                                              style={{ marginBottom: "5px" }}
                                              color="primary"
                                              size="sm"
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
                                Nothing To Show Yet... Add Some Units
                              </CardTitle>
                            </div>
                          </Card>
                        )}
                      </>
                    ) : (
                      "Loading..."
                    )}
                  </>
                )}
              </>
            ) : (
              <Button
                style={{ width: "100%", marginBottom: "15px" }}
                onClick={() => setLoading(!loading)}
                className="btn-fill"
                color="primary"
                size="sm"
              >
                <FiArrowLeft size={20} />{" "}
                <font style={{ paddingLeft: "30px" }}>Back To Units </font>
              </Button>
            )}
          </Col>
        ) : null}

        {viewMode === "current" ? (
          <UnitData currentUnit={currentUnit} setViewMode={setViewMode} />
        ) : null}
      </Row>
    </>
  );
}

export default Unit;
