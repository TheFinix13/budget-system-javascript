import React, { useState } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { MdDescription } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import axios from "axios";
import Departments from "../ministry/Departments";

import { sectors, ministry, user } from "data/api";
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
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Form,
} from "reactstrap";
import { Link } from "react-router-dom";

function MinistryData({ currentMinistry, setCurrentMinistry, setViewMode }) {
  const [hideMinistry, setHideMinistry] = useState(false);

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });

  async function updateMinistry(e) {
    e.preventDefault();
    let { name, sector, description, location } = currentMinistry;

    await axios
      .patch(ministry.updateMinistry + "/" + currentMinistry.id, {
        name,
        sector,
        description,
        location,
      })
      .then((res) => {
        if (res.data.status) {
          setNotificationDetails({
            msg: "Ministry Updated Successfully",
            type: "success",
            change: res.data.change,
          });
        } else {
          setNotificationDetails({
            msg: "Error Updating Ministry",
            type: "danger",
          });
        }
        setNotificationStatus(true);
      });
  }

  async function updateUser(e) {
    e.preventDefault();
    let { firstname, lastname, email, password } = currentMinistry.User;

    await axios
      .patch(user.updateUser + "/" + currentMinistry.User.id, {
        firstname,
        lastname,
        email,
        password,
      })
      .then((res) => {
        if (res.data.status) {
          setNotificationDetails({
            msg: "User Updated Successfully",
            type: "success",
            change: res.data.change,
          });
        } else {
          setNotificationDetails({
            msg: "Error Updating User",
            type: "danger",
          });
        }
        setNotificationStatus(true);
      });
  }

  return (
    <>
      {notificationStatus ? (
        <Notifications details={notificationDetails} />
      ) : null}
      {hideMinistry ? null : (
        <Col md={12}>
          <Card>
            <CardHeader>
              <CardTitle className="pull-left" tag="h4">
                {currentMinistry.name}
              </CardTitle>
              <div className="pull-right" style={{ marginBottom: "20px" }}>
                <Row>
                  <Link>
                    <Button
                      className="btn-fill"
                      onClick={toggle}
                      style={{ marginRight: "15px" }}
                      color="primary"
                      type="submit"
                      size="sm"
                    >
                      <FaEdit size={20} /> Edit Data
                    </Button>
                  </Link>
                  <Link>
                    <Button
                      className="btn-fill"
                      onClick={() => setViewMode("all")}
                      style={{ marginRight: "15px" }}
                      color="primary"
                      type="submit"
                      size="sm"
                    >
                      <HiArrowNarrowLeft size={20} /> Back to Ministries
                    </Button>
                  </Link>
                </Row>
              </div>
            </CardHeader>
            <Col>
              <h5>
                <MdDescription size={20} />
                Description: {currentMinistry.description}
              </h5>
              <h5>
                <MdDescription size={20} />
                Address: {currentMinistry.location}
              </h5>
              <h5>
                <MdDescription size={20} />
                Sector: {currentMinistry.sector}
              </h5>
            </Col>
          </Card>
        </Col>
      )}

      <Col>
        <card className="grow">
          <Departments
            ministry_id={currentMinistry.id}
            setHideMinistry={setHideMinistry}
          />
        </card>
      </Col>

      <Modal isOpen={modal} toggle={toggle} backdrop={true}>
        <ModalHeader toggle={toggle}>Edit Ministry Data</ModalHeader>
        <ModalBody style={{ textAlign: "center" }}>
          <Form>
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>Name of Ministry</label>
                  <Input
                    placeholder="Eg: Ministry of Education"
                    type="text"
                    style={{ color: "#aaa" }}
                    defaultValue={currentMinistry.name}
                    onChange={(e) =>
                      setCurrentMinistry({
                        ...currentMinistry,
                        name: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>Sector</label>
                  <Input
                    placeholder="Eg: Ministry of Education"
                    type="select"
                    style={{ color: "#aaa" }}
                    defaultValue={currentMinistry.sector}
                    onChange={(e) =>
                      setCurrentMinistry({
                        ...currentMinistry,
                        sector: e.target.value,
                      })
                    }
                  >
                    {sectors.map((sector, index) => {
                      return <option key={index}>{sector}</option>;
                    })}
                  </Input>
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>Description</label>
                  <Input
                    type="textarea"
                    placeholder="Short descrption about ministry..."
                    style={{ color: "#aaa" }}
                    defaultValue={currentMinistry.description}
                    onChange={(e) =>
                      setCurrentMinistry({
                        ...currentMinistry,
                        description: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </Col>

              <Col md="6">
                <FormGroup>
                  <label>Address</label>
                  <Input
                    type="textarea"
                    placeholder="No 13 Magodo Street"
                    style={{ color: "#aaa" }}
                    defaultValue={currentMinistry.location}
                    onChange={(e) =>
                      setCurrentMinistry({
                        ...currentMinistry,
                        location: e.target.value,
                      })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
            <Button
              className="btn-fill"
              color="primary"
              type="submit"
              onClick={(e) => updateMinistry(e)}
            >
              Update Ministry
            </Button>

            <h4>User Details</h4>
            <hr />
            <Row>
              <Col md="6">
                <FormGroup>
                  <label>First Name</label>
                  <Input
                    placeholder="Eg: John"
                    type="text"
                    style={{ color: "#aaa" }}
                    defaultValue={currentMinistry?.User?.firstname}
                    onChange={(e) =>
                      setCurrentMinistry({
                        ...currentMinistry,
                        User: {
                          ...currentMinistry.User,
                          firstname: e.target.value,
                        },
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>Last Name</label>
                  <Input
                    placeholder="Eg: Doe"
                    type="text"
                    style={{ color: "#aaa" }}
                    defaultValue={currentMinistry?.User?.lastname}
                    onChange={(e) =>
                      setCurrentMinistry({
                        ...currentMinistry,
                        User: {
                          ...currentMinistry.User,
                          lastname: e.target.value,
                        },
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>Email</label>
                  <Input
                    placeholder="Eg: doe@gmail.com"
                    type="text"
                    style={{ color: "#aaa" }}
                    defaultValue={currentMinistry?.User?.email}
                    onChange={(e) =>
                      setCurrentMinistry({
                        ...currentMinistry,
                        User: {
                          ...currentMinistry.User,
                          email: e.target.value,
                        },
                      })
                    }
                  />
                </FormGroup>
              </Col>
              <Col md="6">
                <FormGroup>
                  <label>Password</label>
                  <Input
                    type="password"
                    style={{ color: "#aaa" }}
                    onChange={(e) =>
                      setCurrentMinistry({
                        ...currentMinistry,
                        User: {
                          ...currentMinistry.User,
                          password: e.target.value,
                        },
                      })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>

            <Button
              className="btn-fill"
              color="primary"
              type="submit"
              onClick={(e) => updateUser(e)}
            >
              Update User
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default MinistryData;
