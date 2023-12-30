import React, { useState } from "react";
import Notifications from "components/Notification/Notification";
import { unit } from "../../data/api";
import LoadingOverlay from "react-loading-overlay";
import axios from "axios";
import { HiArrowNarrowLeft } from "react-icons/hi";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function AddUnit({ department_id, setIsAdd }) {
  const [unitData, setUnitData] = useState({});
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  const [requestLoading, setRequestLoading] = useState(false);

  async function addUnit(e) {
    setRequestLoading(true);
    console.log(department_id);
    e.preventDefault();
    await axios
      .post(unit.addUnit + "/" + department_id, unitData)
      .then((response) => {
        if (response.data.status) {
          setNotificationDetails({
            msg: "Units Created Successfully",
            type: "success",
          });
          setUnitData({});
        } else {
          setNotificationDetails({
            msg: "Error Creating Units...",
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
          <Col md="12">
            <LoadingOverlay
              active={requestLoading}
              spinner
              text="Loading your request..."
            >
              <Card>
                <CardHeader>
                  <CardTitle className="pull-left" tag="h4">
                    Add Unit
                  </CardTitle>
                  <div className="pull-right" style={{ marginBottom: "20px" }}>
                    <Row>
                      <Button
                        className="btn-fill"
                        onClick={() => setIsAdd(false)}
                        style={{ width: "100%", marginRight: "15px" }}
                        color="primary"
                        size={"sm"}
                      >
                        <HiArrowNarrowLeft size={20} /> Back to Unit
                      </Button>
                    </Row>
                  </div>
                </CardHeader>
                <CardBody>
                  <Form
                    onSubmit={(e) => {
                      addUnit(e);
                    }}
                  >
                    <Row>
                      <Col md="6" className="pr-md-1">
                        <FormGroup>
                          <label>Name of Unit</label>
                          <Input
                            placeholder="Eg: Unit for Chairs"
                            type="text"
                            onChange={(e) =>
                              setUnitData({ ...unitData, name: e.target.value })
                            }
                          />
                        </FormGroup>
                      </Col>

                      <Col md="6" className="pr-md-1">
                        <FormGroup>
                          <label>Unit Number</label>
                          <Input
                            placeholder="Eg: U101"
                            type="text"
                            onChange={(e) =>
                              setUnitData({
                                ...unitData,
                                number: e.target.value,
                              })
                            }
                          />
                        </FormGroup>
                      </Col>

                      <Col md="12">
                        <FormGroup>
                          <label>Description</label>
                          <Input
                            type="textarea"
                            placeholder="Short descrption about unit..."
                            onChange={(e) =>
                              setUnitData({
                                ...unitData,
                                description: e.target.value,
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
                      onClick={addUnit}
                    >
                      Add Unit
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </LoadingOverlay>
          </Col>

          {/* <Col md="4">

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
                    <h5 className="title">Ministry Name: {ministryData.name} </h5>
                    <h5 className="title">Sector: {ministryData.sector} </h5>
                  </a>
                </div>
                <div className="card-description">
                  Description: {ministryData.description}
                </div>
              </CardBody>
            </Card>

          </Col> */}
        </Row>
      </div>
    </>
  );
}

export default AddUnit;
