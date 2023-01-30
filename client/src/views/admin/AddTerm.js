import React, { useState } from "react";
import axios from "axios";
import Notifications from "components/Notification/Notification";
import { term } from "../../data/api";
import LoadingOverlay from "react-loading-overlay";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function AddTerm() {
  const [termData, setTermData] = useState({});
  const [notificationStatus, setNotificationStatus] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState({
    msg: "",
    type: "",
  });
  const [requestLoading, setRequestLoading] = useState(false);

  async function addTerm(e) {
    setRequestLoading(true);
    e.preventDefault();
    await axios
      .post(term.addTerm, termData)
      .then((response) => {
        if (response.data.status) {
          setNotificationDetails({
            msg: "Term Created Successfully",
            type: "success",
          });
        } else {
          setNotificationDetails({
            msg: "Error Creating Term...",
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
          <Col>
            <LoadingOverlay
              active={requestLoading}
              spinner
              text="Loading your request..."
            >
              <Card>
                <CardBody>
                  <Form>
                    <Row>
                      <Col md="6" className="pr-md-1">
                        <FormGroup>
                          <label>Term Name</label>
                          <Input
                            placeholder="Eg: Term 2016"
                            type="text"
                            onChange={(e) =>
                              setTermData({ ...termData, name: e.target.value })
                            }
                          />
                        </FormGroup>
                      </Col>

                      <Col md="6" className="pl-md-1">
                        <FormGroup>
                          <label>Term Year</label>
                          <Input
                            placeholder="2016"
                            type="number"
                            onChange={(e) =>
                              setTermData({ ...termData, year: e.target.value })
                            }
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Button
                      className="btn-fill"
                      color="primary"
                      type="submit"
                      onClick={addTerm}
                    >
                      Add Term
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

export default AddTerm;
