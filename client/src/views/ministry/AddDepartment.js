import React, { useState } from "react";
import Notifications from "components/Notification/Notification";
import { HiArrowNarrowLeft } from "react-icons/hi";
import LoadingOverlay from "react-loading-overlay";
import axios from "axios";
import { department } from "../../data/api";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  CardTitle,
} from "reactstrap";

function AddDepartment({ ministry_id, setIsAdd }) {
  const [departmentData, setDepartmentData] = useState({});
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  const [requestLoading, setRequestLoading] = useState(false);

  async function addDepartment(e) {
    setRequestLoading(true);
    e.preventDefault();
    await axios
      .post(department.addDepartment + "/" + ministry_id, departmentData)
      .then((response) => {
        if (response.data.status) {
          setNotificationDetails({
            msg: "Department Created Successfully",
            type: "success",
          });
          setDepartmentData({});
          e.target.reset();
        } else {
          setNotificationDetails({
            msg: "Error Creating Department...",
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
                    Add Department
                  </CardTitle>
                  <div className="pull-right" style={{ marginBottom: "20px" }}>
                    <Row>
                      <Button
                        className="btn-fill"
                        onClick={() => setIsAdd(false)}
                        style={{ width: "100%", marginRight: "15px" }}
                        color="primary"
                        size="sm"
                      >
                        <HiArrowNarrowLeft size={20} /> Back to Departments
                      </Button>
                    </Row>
                  </div>
                </CardHeader>

                <CardBody>
                  <Form
                    onSubmit={(e) => {
                      addDepartment(e);
                    }}
                  >
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>Name of Department</label>
                          <Input
                            placeholder="Eg: Department of Finance"
                            type="text"
                            onChange={(e) =>
                              setDepartmentData({
                                ...departmentData,
                                name: e.target.value,
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
                            placeholder="Short descrption about department..."
                            onChange={(e) =>
                              setDepartmentData({
                                ...departmentData,
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
                      size="sm"
                    >
                      Add Department
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </LoadingOverlay>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AddDepartment;
