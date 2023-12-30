import React, { useState, useEffect } from "react";
import { authenticate } from "../../data/api";
import Notifications from "components/Notification/Notification";
import axios from "axios";

// reactstrap components
import {
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

function Profile() {
  const [userDetails, setUserDetails] = useState({});
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      await axios.get(authenticate.getUserData).then((response) => {
        if (response.data) {
          setUserDetails(response.data);
        } else {
          setNotificationDetails({
            msg: "Error Fetching Store Details",
            type: "Danger",
          });
          setNotificationStatus(true);
        }
      });
    }
    fetchProfile();
  }, []);

  return (
    <>
      <div className="content">
        {Object.keys(userDetails).length > 0 ? (
          <Row>
            <Col md="8">
              {notificationStatus ? (
                <Notifications details={notificationDetails} />
              ) : null}
              <Card>
                <CardHeader>
                  <h5 className="title">Edit Profile</h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col className="pr-md-1" md="4">
                        <FormGroup>
                          <label>First Name</label>
                          <Input
                            defaultValue={userDetails?.firstname}
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>

                      <Col className="px-md-1" md="4">
                        <FormGroup>
                          <label>Last Name</label>
                          <Input
                            defaultValue={userDetails?.lastname}
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-md-1" md="4">
                        <FormGroup>
                          <label htmlFor="exampleInputEmail1">
                            Email address
                          </label>
                          <Input
                            disabled
                            defaultValue={userDetails?.email}
                            type="email"
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Address</label>
                          <Input
                            defaultValue={userDetails?.Ministry?.location}
                            placeholder="Location Address"
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <label>Description</label>
                          <hr />
                          {userDetails?.Ministry?.description}
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col md="4">
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
                        src={require("views/auth/img/logo.png").default}
                      />
                      <h5 className="title">{userDetails.name}</h5>
                    </a>
                    <p className="description">ANAMBARA STATE GOVERNMENT</p>
                    <p className="description">{userDetails?.Ministry?.name}</p>
                  </div>
                  <div className="card-description">{userDetails.about}</div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        ) : null}
      </div>
    </>
  );
}

export default Profile;
