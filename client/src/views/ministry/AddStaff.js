import React, { useState } from "react";
import Axios from "axios";
import Notifications from "components/Notification/Notification";
import { staff } from "../../data/api";
import LoadingOverlay from "react-loading-overlay";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function AddStaff() {
  const [staffData, setStaffData] = useState("");

  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });

  const [requestLoading, setRequestLoading] = useState(false);

  async function addStaff(e) {
    e.preventDefault();
    setRequestLoading(true);
    if (
      staffData.name === "" ||
      staffData.email === "" ||
      staffData.phone === "" ||
      staffData.password === ""
    ) {
      setNotificationDetails({
        msg: "Some Staff Fields are Empty",
        type: "danger",
      });
      setNotificationStatus(true);
    } else {
      await Axios.post(staff.addStaff, staffData).then((res) => {
        if (res.data.status) {
          setNotificationDetails({
            msg: "Staff Created Successfully",
            type: "success",
          });
        } else {
          setNotificationDetails({
            msg: "Error Creating Staff, make sure all fields are filled or try refreshing page.",
            type: "danger",
          });
        }
        setNotificationStatus(true);
      });
    }
    setRequestLoading(false);
  }

  return (
    <>
      {notificationStatus ? (
        <Notifications details={notificationDetails} />
      ) : null}
      <div className="content">
        <Row>
          <Col md="8">
            <Card>
              <CardHeader>
                <h5 className="title">Add Staff </h5>
              </CardHeader>
              <CardBody>
                <Form onSubmit={addStaff}>
                  <Row>
                    <Col className="pr-md-1" md="6">
                      <FormGroup>
                        <label>Staff Name</label>
                        <Input
                          placeholder="Tecno Camon CX"
                          type="text"
                          onChange={(e) =>
                            setStaffData({ ...staffData, name: e.target.value })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col className="pl-md-1" md="6">
                      <FormGroup>
                        <label>Email</label>
                        <Input
                          placeholder="e.g bounce@gmail.com"
                          type="text"
                          onChange={(e) =>
                            setStaffData({
                              ...staffData,
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
                        <label>Phone Number</label>
                        <Input
                          placeholder="09012345678"
                          type="text"
                          onChange={(e) =>
                            setStaffData({
                              ...staffData,
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
                          placeholder=""
                          type="password"
                          onChange={(e) =>
                            setStaffData({
                              ...staffData,
                              password: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Button className="btn-fill" color="primary" type="submit">
                    Add Staff
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <LoadingOverlay
              active={requestLoading}
              spinner
              text="Loading your request..."
            >
              <Card className="card-user">
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
                      <h5 className="title">Staff Name: {staffData.name} </h5>
                      <h5 className="title">Email: {staffData.email} </h5>
                    </a>
                  </div>
                  <div className="card-description"></div>
                </CardBody>
              </Card>
            </LoadingOverlay>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AddStaff;
