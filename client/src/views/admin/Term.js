import React, { useState, useEffect } from "react";
import axios from "axios";
import { term } from "../../data/api";

import Notifications from "components/Notification/Notification";
import { FiArrowLeft } from "react-icons/fi";
import { IoMdAddCircle } from "react-icons/io";

import empty from "../../assets/img/product.svg";
import { Link } from "react-router-dom";
import AddTerm from "./AddTerm";
// import UnitData from "./UnitData";
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
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

function Term() {
  const [showTerm, setTerm] = useState([]);
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  const [dataload, setDataLoad] = useState(true);

  async function fetchTerm() {
    await axios.get(term.showTerm).then((response) => {
      if (response.data.status === true) {
        setTerm(response.data.data);
        setDataLoad(false);
      } else {
        setNotificationDetails({
          msg: "Error Loading Tenors, Please Referesh The Page",
          type: "danger",
        });
        setNotificationStatus(true);
        setDataLoad(false);
      }
    });
  }

  useEffect(
    () => {
      fetchTerm();
    },
    // eslint-disable-next-line
    []
  );

  async function activeTerm(id) {
    setDataLoad(true);
    await axios.put(term.updateTerm + "/" + id).then((response) => {
      if (response.data.status === true) {
        setDataLoad(false);
        fetchTerm();
      } else {
        setNotificationDetails({
          msg: "Error Loading Tenors, Please Referesh The Page",
          type: "danger",
        });
        setNotificationStatus(true);
        setDataLoad(false);
      }
    });
  }

  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");

  return (
    <>
      {notificationStatus ? (
        <Notifications details={notificationDetails} />
      ) : null}
      <div className="content">
        <Row>
          <Col md="12">
            {loading === true ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="pull-left" tag="h4">
                      Terms
                    </CardTitle>
                    <div
                      className="pull-right"
                      style={{ marginBottom: "20px" }}
                    >
                      <Row>
                        <Link style={{ paddingRight: "10px" }}>
                          <Input
                            placeholder="Search based on Annual Tenor"
                            type="text"
                            value={q}
                            style={{ width: "100%" }}
                            onChange={(e) => setQ(e.target.value)}
                          />
                        </Link>

                        <Link>
                          <Button
                            className="btn-fill"
                            style={{ marginRight: "15px" }}
                            color="primary"
                            type="submit"
                            size="sm"
                            onClick={toggle}
                          >
                            <IoMdAddCircle size={20} /> Add Term
                          </Button>
                        </Link>
                      </Row>
                    </div>
                  </CardHeader>
                </Card>

                {dataload === false ? (
                  <>
                    {showTerm.length > 0 ? (
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
                                  <th>Name</th>
                                  <th>Year</th>
                                  <th>Change Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {showTerm.map((row, key) => (
                                  <tr key={key}>
                                    <td key={key}>{key + 1} </td>
                                    <td key={key}>{row.name} </td>
                                    <td key={key}>{row.year} </td>
                                    {/* <td key={key}>{row.budget}</td> */}

                                    <td>
                                      <Button
                                        onClick={() => {
                                          activeTerm(row.id);
                                        }}
                                        size="sm"
                                        disabled={
                                          row.status === "active" ? true : false
                                        }
                                        className="btn-fill"
                                        style={{
                                          marginBottom: "5px",
                                          marginLeft: "10px",
                                        }}
                                        color="primary"
                                      >
                                        {" "}
                                        {row.status}
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
                            Nothing To Show Yet... Add a Term
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
        </Row>
      </div>

      <Modal isOpen={modal} toggle={toggle} backdrop={true} size="lg">
        <ModalHeader toggle={toggle}>Add Term</ModalHeader>
        <ModalBody style={{ textAlign: "center" }}>
          <AddTerm />
        </ModalBody>
      </Modal>
    </>
  );
}

export default Term;
