import React, { useState } from "react";
import Axios from "axios";
import Notifications from "components/Notification/Notification";
import { ministry, sectors } from "../../data/api";
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
  Table,
} from "reactstrap";
import axios from "axios";

function AddMinistry() {
  const [ministryData, setMinistryData] = useState({});
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  const [requestLoading, setRequestLoading] = useState(false);

  async function addMinistry(e) {
    setRequestLoading(true);
    e.preventDefault();
    await axios
      .post(ministry.addMinistry, ministryData)
      .then((response) => {
        if (response.data.status) {
          setNotificationDetails({
            msg: "Ministry Created Successfully",
            type: "success",
          });
        } else {
          setNotificationDetails({
            msg: "Error Creating Ministry...",
            type: "success",
          });
        }
        setNotificationStatus(true);
      })
      .catch((error) => {
        if (error.response) {
          setNotificationDetails({
            msg: error.response.data.msg,
            type: "danger",
          });
          setNotificationStatus(true);
        } else {
          setNotificationDetails({ msg: "Network Error!", type: "danger" });
          setNotificationStatus(true);
        }
      });
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
            <LoadingOverlay
              active={requestLoading}
              spinner
              text="Loading your request..."
            >
              <Card>
                <CardHeader>
                  <h5 className="title">Add Ministry </h5>
                </CardHeader>
                <CardBody>
                  <Form>
                    <Row>
                      <Col md="6" className="pr-md-1">
                        <FormGroup>
                          <label>Name of Ministry</label>
                          <Input
                            placeholder="Eg: Ministry of Education"
                            type="text"
                            onChange={(e) =>
                              setMinistryData({
                                ...ministryData,
                                name: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>
                      <Col md="6" className="pl-md-1">
                        <FormGroup>
                          <label>Sector</label>
                          <Input
                            placeholder="Eg: Ministry of Education"
                            type="select"
                            onChange={(e) =>
                              setMinistryData({
                                ...ministryData,
                                sector: e.target.value,
                              })
                            }
                          >
                            <option disabled> Select a sector...</option>
                            {sectors.map((sector, index) => {
                              return <option key={index}>{sector}</option>;
                            })}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md="12">
                        <FormGroup>
                          <label>Description</label>
                          <Input
                            type="textarea"
                            placeholder="Short descrption about ministry..."
                            onChange={(e) =>
                              setMinistryData({
                                ...ministryData,
                                description: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>

                      <Col md="12">
                        <FormGroup>
                          <label>Address</label>
                          <Input
                            type="textarea"
                            placeholder="No 13 Magodo Street"
                            onChange={(e) =>
                              setMinistryData({
                                ...ministryData,
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
                      onClick={addMinistry}
                    >
                      Add Ministry
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </LoadingOverlay>
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
                      src={require("assets/img/product.png").default}
                    />
                    <h5 className="title">
                      Ministry Name: {ministryData.name}{" "}
                    </h5>
                    <h5 className="title">Sector: {ministryData.sector} </h5>
                  </a>
                </div>
                <div className="card-description">
                  Description: {ministryData.description}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AddMinistry;
