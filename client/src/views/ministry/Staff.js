import React, { useState, useEffect } from "react";
import axios from "axios";
import { staff } from "../../data/api";
import Notifications from "components/Notification/Notification";
import { FiArrowLeft } from "react-icons/fi";
import empty from "../assets/img/product.svg";
import { Link } from "react-router-dom";
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
  CardText,
  Input,
  FormGroup,
  ButtonGroup,
} from "reactstrap";

function Staff() {
  //let symbol = "₦";
  const [staffs, setStaffs] = useState([]);
  const [currentStaff, setCurrentStaff] = useState({});

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  const [dataload, setDataLoad] = useState(true);

  useEffect(() => {
    async function fetchStaffs() {
      await axios.get(staff.showStoreStaff).then((response) => {
        if (response.data.status === true) {
          setStaffs(response.data.data);
          setDataLoad(false);
        } else {
          setNotificationDetails({
            msg: "Error Loading Staffs, Please Referesh The Page",
            type: "danger",
          });
          setNotificationStatus(true);
          setDataLoad(false);
        }
      });
    }
    fetchStaffs();
  }, []);

  async function updateStaff() {
    await axios.patch(staff.updateStaff, currentStaff).then((res) => {
      if (res.data.status) {
        setNotificationDetails({
          msg: "Staff Updated Successfully",
          type: "success",
          change: res.data.change,
        });
      } else {
        setNotificationDetails({ msg: "Error Updating Staff", type: "danger" });
      }
      setNotificationStatus(true);
    });
  }

  const [loading, setLoading] = useState(true);

  function selectStaff(id) {
    setCurrentStaff(staffs.filter((item) => item._id === id)[0]);
    setLoading(false);
  }

  const [q, setQ] = useState("");
  const [searchColumns, setSearchColumns] = useState([
    "name",
    "email",
    "phone",
  ]);

  function search(rows) {
    return rows.filter((row) =>
      searchColumns.some(
        (column) =>
          row[column].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
      )
    );
  }

  const result = staffs.map(({ _id, name, email, phone }) => ({
    _id,
    name,
    email,
    phone,
  }));
  const columns = result[0] && Object.keys(result[0]);

  return (
    <>
      {notificationStatus ? (
        <Notifications details={notificationDetails} />
      ) : null}
      <div className="content">
        <Row>
          <Col md="12">
            {loading === true ? (
              <Card>
                <CardHeader>
                  <CardTitle className="pull-left" tag="h4">
                    Staff
                  </CardTitle>
                  <div className="pull-right" style={{ marginBottom: "20px" }}>
                    <Link to="/admin/addstaff">
                      <Button
                        className="btn-fill"
                        style={{ width: "100%" }}
                        color="primary"
                        type="submit"
                      >
                        Add Staff
                      </Button>
                    </Link>
                  </div>
                  <FormGroup style={{ width: "100%" }} className="pull-right">
                    <Input
                      placeholder="Search based on checked items"
                      type="text"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                    />
                  </FormGroup>
                </CardHeader>

                <Col sm="12">
                  <ButtonGroup
                    className="btn-group-toggle float-right"
                    data-toggle="buttons"
                  >
                    {columns &&
                      columns.map((column, key) => (
                        <Button
                          tag="label"
                          className="btn-simple"
                          color="info"
                          key={key}
                          size="sm"
                          onClick={() => {
                            const checked = searchColumns.includes(column);
                            setSearchColumns((prev) =>
                              checked
                                ? prev.filter((sc) => sc !== column)
                                : [...prev, column]
                            );
                          }}
                          active={searchColumns.includes(column)}
                        >
                          {column}
                        </Button>
                      ))}
                  </ButtonGroup>
                </Col>
                {dataload === false ? (
                  <>
                    {staffs.length > 0 ? (
                      <CardBody>
                        <Table
                          className="tablesorter"
                          responsive
                          style={{ overflow: "unset" }}
                        >
                          <thead className="text-primary">
                            <tr>
                              <th>Staff Name</th>
                              <th>Email</th>
                              <th>Phone</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {search(result).map((row, key) => (
                              <tr key={key}>
                                {columns.map((column, key) => (
                                  <>
                                    {key > 0 ? (
                                      <td key={key}>{row[column]} </td>
                                    ) : null}
                                  </>
                                ))}
                                <td>
                                  <div>
                                    <Button
                                      onClick={() => selectStaff(row._id)}
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
                          Nothing To Show Yet... Add Some Staffs to The System
                        </CardTitle>
                      </div>
                    )}
                  </>
                ) : (
                  "Loading"
                )}
              </Card>
            ) : (
              <Button
                style={{ width: "100%", marginBottom: "15px" }}
                onClick={() => setLoading(!loading)}
                className="btn-fill"
                color="primary"
              >
                <FiArrowLeft size={20} />{" "}
                <font style={{ paddingLeft: "30px" }}>Back To Staffs </font>
              </Button>
            )}
          </Col>
          <Col md="12">
            <Card className="card-user">
              {loading === false ? (
                <CardBody>
                  <CardText />
                  <div className="author">
                    <div className="block block-one" />
                    <div className="block block-two" />
                    <div className="block block-three" />
                    <div className="block block-four" />
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar"
                        src={require("assets/img/product.png").default}
                      />
                      <Row>
                        <Col className="pr-md-1" md="6">
                          <FormGroup>
                            <label>Staff Name</label>
                            <Input
                              placeholder="Bounce Jonce"
                              type="text"
                              value={currentStaff.name}
                              onChange={(e) =>
                                setCurrentStaff({
                                  ...currentStaff,
                                  name: e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col className="pl-md-1" md="6">
                          <FormGroup>
                            <label>Email</label>
                            <Input
                              placeholder="bounce@gmail.com"
                              type="text"
                              value={currentStaff.email}
                              onChange={(e) =>
                                setCurrentStaff({
                                  ...currentStaff,
                                  email: e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="pr-md-1" md="6">
                          <FormGroup>
                            <label>Phone</label>
                            <Input
                              placeholder="09012345678"
                              type="text"
                              value={currentStaff.phone}
                              onChange={(e) =>
                                setCurrentStaff({
                                  ...currentStaff,
                                  phone: e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                        </Col>
                        <Col className="pl-md-1" md="6">
                          <FormGroup>
                            <label>Password</label>
                            <Input
                              placeholder="Type a new password to change former password"
                              type="text"
                              defaultValue={currentStaff.password}
                              onChange={(e) =>
                                setCurrentStaff({
                                  ...currentStaff,
                                  upassword: e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </a>
                  </div>

                  <Row>
                    <Col md="6">
                      <Button
                        onClick={() => updateStaff()}
                        className="btn-fill"
                        style={{ width: "100%" }}
                        color="primary"
                        type="submit"
                      >
                        Update Staff
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              ) : (
                "--------------------------------"
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Staff;
