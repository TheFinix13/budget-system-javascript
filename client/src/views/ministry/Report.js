import React, { useState, useEffect, useRef } from "react";
import { department, unit, term, report, ministry } from "../../data/api";
import Notifications from "components/Notification/Notification";
import axios from "axios";

import { Link } from "react-router-dom";
import { BiExport } from "react-icons/bi";
import { AiFillPrinter } from "react-icons/ai";
import { useAuth } from "contexts/AuthContext";
import { saveAs } from "file-saver";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Table,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";

function Report() {
  const printDiv = useRef(null);
  const { userDetail } = useAuth();
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });

  const [searchData, setSearchData] = useState({
    operation: "expenditure",
    ministryId: userDetail.ministryId || 0,
  });

  const [terms, setTerms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [units, setUnits] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [ministryName, setMinistryName] = useState(
    userDetail?.Ministry?.name || "All"
  );

  const [reportData, setReportData] = useState({});

  const handlePrint = () => {
    const printContents = printDiv.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  };

  const handleExport = () => {
    if (!reportData.operationData) return;

    let csvString = "DEPARTMENT,UNIT,DESCRIPTION,AMOUNT,DATE\n";
    Object.entries(reportData.operationData).forEach(([department, data]) => {
      csvString += `${data.Department.name},${data.Unit.name},${
        data.description
      },${data.amount},${new Date(data.date).toLocaleDateString()}\n`;
    });

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "report.csv");
  };

  useEffect(async () => {
    async function fetchTerm() {
      await axios.get(term.showTerm).then((response) => {
        if (response.data.status === true) {
          setTerms(response.data.data);
          // setDataLoad(false);
        } else {
          setNotificationDetails({
            msg: "Error Loading Terms",
            type: "danger",
          });
          setNotificationStatus(true);
          // setDataLoad(false);
        }
      });
    }

    async function fetchMinistries() {
      await axios.get(ministry.showAllMinistries).then((response) => {
        if (response.data.status === true) {
          setMinistries(response.data.data);
          // setDataLoad(false);
        } else {
          setNotificationDetails({
            msg: "Error Loading Ministries",
            type: "danger",
          });
          setNotificationStatus(true);
          // setDataLoad(false);
        }
      });
    }

    if (userDetail.type === "admin") {
      fetchMinistries();
    }

    fetchTerm();
  }, []);

  useEffect(async () => {
    let endpoint = "";
    if (searchData.operation === "budget") {
      endpoint = report.expenditure;
    } else {
      endpoint = report.budget;
    }
    async function fetchReport() {
      await axios.get(endpoint, { params: searchData }).then((response) => {
        if (response.data.status === true) {
          setReportData(response.data.data);
          // setDataLoad(false);,
        } else {
          setNotificationDetails({
            msg: "Error Loading Report",
            type: "danger",
          });
          setNotificationStatus(true);
          // setDataLoad(false);
        }
      });
    }

    async function fetchDepartments() {
      await axios
        .get(
          department.showAllDepartmentsMinistry + "/" + searchData.ministryId
        )
        .then((response) => {
          if (response.data.status === true) {
            setDepartments(response.data.data);
            // setDataLoad(false);
          } else {
            setNotificationDetails({
              msg: "Error Loading Departments",
              type: "danger",
            });
            setNotificationStatus(true);
            // setDataLoad(false);
          }
        });
    }
    fetchDepartments();
    fetchReport();
  }, [searchData]);

  async function fetchUnits(departmentId) {
    await axios.get(unit.showUnits + "/" + departmentId).then((response) => {
      if (response.data.status === true) {
        setUnits(response.data.data);
        // setDataLoad(false);
      } else {
        setNotificationDetails({
          msg: "Error Loading Units",
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
      <div className="content">
        <Row>
          <Card>
            <CardHeader>
              <CardTitle className="pull-left" tag="h4">
                Report
              </CardTitle>
              <div className="pull-right" style={{ marginBottom: "20px" }}>
                <Row>
                  <Link style={{ marginRight: "15px" }}>
                    <Button
                      className="btn-fill"
                      size="sm"
                      style={{ width: "100%" }}
                      color="primary"
                      type="submit"
                      onClick={handleExport}
                    >
                      <BiExport size={20} /> Export Report
                    </Button>
                  </Link>{" "}
                  <Link style={{ marginRight: "15px" }}>
                    <Button
                      onClick={handlePrint}
                      className="btn-fill"
                      size="sm"
                      style={{ width: "100%" }}
                      color="primary"
                      type="submit"
                    >
                      <AiFillPrinter size={20} /> Print Report
                    </Button>
                  </Link>
                </Row>
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                {userDetail.type === "admin" ? (
                  <Col md="3">
                    <FormGroup>
                      <Label for="term">Ministry</Label>
                      <Input
                        id="ministry"
                        name="select"
                        type="select"
                        onChange={(e) => {
                          setSearchData({
                            ...searchData,
                            ministryId: JSON.parse(e.target.value).id,
                          });
                          setMinistryName(JSON.parse(e.target.value).name);
                          setUnits([]);
                        }}
                      >
                        <option value={0}>All</option>
                        {ministries.map((item, key) => {
                          return (
                            <option
                              key={key}
                              value={JSON.stringify({
                                id: item.id,
                                name: item.name,
                              })}
                            >
                              {item.name}
                            </option>
                          );
                        })}
                      </Input>
                    </FormGroup>
                  </Col>
                ) : null}

                <Col>
                  <FormGroup>
                    <Label for="term">Term</Label>
                    <Input
                      id="term"
                      name="select"
                      type="select"
                      onChange={(e) => {
                        setSearchData({
                          ...searchData,
                          termId: e.target.value,
                        });
                      }}
                    >
                      <option value={0}>All</option>
                      {terms.map((item, key) => {
                        return (
                          <option key={key} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <Label for="department">Departments</Label>
                    <Input
                      id="department"
                      name="select"
                      type="select"
                      onChange={(e) => {
                        setSearchData({
                          ...searchData,
                          departmentId: e.target.value,
                        });
                        fetchUnits(e.target.value);
                        // setAllAssets(JSON.parse(e.target.value).AC);
                      }}
                    >
                      <option value={0}>All Departments</option>
                      {departments.map((item, key) => {
                        return (
                          <option key={key} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <Label for="department">Units</Label>
                    <Input
                      id="unit"
                      name="select"
                      type="select"
                      onChange={(e) => {
                        setSearchData({
                          ...searchData,
                          unitId: e.target.value,
                        });
                        // setAllAssets(JSON.parse(e.target.value).AC);
                      }}
                    >
                      <option value={0}>All Units</option>
                      {units.map((item, key) => {
                        return (
                          <option key={key} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </Input>
                  </FormGroup>
                </Col>

                <Col>
                  <FormGroup>
                    <Label for="operation">Operation</Label>
                    <Input
                      id="operation"
                      name="select"
                      type="select"
                      defaultValue={"budget"}
                      onChange={(e) => {
                        setSearchData({
                          ...searchData,
                          operation: e.target.value,
                        });
                        // setAllAssets(JSON.parse(e.target.value).AC);
                      }}
                    >
                      <option>expenditure</option>
                      <option>budget</option>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card>
            {" "}
            <div ref={printDiv}>
              <hr />

              {reportData?.operationData?.length || 0 > 0 ? (
                <div>
                  <CardHeader tag="b">Ministry: {ministryName}</CardHeader>
                  <hr />
                  <CardHeader>
                    ALL {searchData.operation.toUpperCase()}S BY DEPARTMENT
                  </CardHeader>
                  <br />
                  <CardBody>
                    <Table>
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(
                          reportData?.operationByDepartment || {}
                        ).map((department) => (
                          <>
                            <tr key={unit}>
                              <td>{department}</td>
                              <td>
                                {
                                  reportData?.operationByDepartment[department]
                                    .total
                                }
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                  <CardHeader>
                    ALL {searchData.operation.toUpperCase()}S BY UNIT
                  </CardHeader>
                  <br />
                  <CardBody>
                    <Table>
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Unit</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(
                          reportData?.operationByDepartment || {}
                        ).map((department) => (
                          <>
                            {Object.keys(
                              reportData?.operationByDepartment[department][
                                "units"
                              ] || {}
                            ).map((unit) => (
                              <tr key={unit}>
                                <td>{department}</td>
                                <td>{unit}</td>
                                <td>
                                  {reportData?.operationByDepartment[
                                    department
                                  ]["units"][unit] || {}}
                                </td>
                              </tr>
                            ))}
                          </>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                  <CardHeader>
                    All {searchData.operation.toUpperCase()}S
                  </CardHeader>
                  <CardBody>
                    <Table>
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Unit</th>
                          <th>Description</th>
                          <th>Amount</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(reportData?.operationData || []).map((ex, key) => (
                          <tr key={key}>
                            <td>{ex.Department.name}</td>
                            <td>{ex.Unit.name}</td>
                            <td>{ex.description || ex?.data?.notes}</td>
                            <td>{ex.amount}</td>
                            <td>
                              {new Date(
                                ex.date || ex.createdAt
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>{" "}
                </div>
              ) : (
                <h3 style={{ textAlign: "center" }}>NO REPORT!</h3>
              )}
            </div>
          </Card>
        </Row>
      </div>
    </>
  );
}

export default Report;
