import React, { useEffect, useState } from "react";
import ChartistGraph from "react-chartist";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import firebase from 'firebase/app'
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore"


function Dashboard() {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [requestData, setRequestData] = useState([])
  const [renderRequest, setRenderRequest] = useState(false)
  const [registerData, setRegisterData] = useState([])
  const [renderRegister, setRenderRegister] = useState(false)
  // Handle user state changes
  var firebaseConfig = {
    apiKey: "AIzaSyB0xDpz8SbOhsUQd4vNBp_7VVV2QcQtJwg",
    authDomain: "safe-citizen-life.firebaseapp.com",
    databaseURL: "https://safe-citizen-life-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "safe-citizen-life",
    storageBucket: "safe-citizen-life.appspot.com",
    messagingSenderId: "892516878198",
    appId: "1:892516878198:web:614fc9219dcb5b09405c57"
  };
  function onAuthStateChanged(user) {
    console.log("AUTHSATECHANGED")
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    // console.log("SUNSCRIBER",subscriber)
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {

    fetch('http://localhost:3000/admin/list')
      .then((res => {
        return res.json()
      }))
      .then((result) => {
        if (result.success) {
          setRegisterData(result.result)
        }
        else {
          alert(result.error.message)
        }

      })
      .catch((err) => {
        console.log("ERROR", err)
        alert(err.message)
      })


  }, [renderRegister])

  useEffect(() => {

    fetch('http://localhost:3000/admin/request')
      .then((res => {
        return res.json()
      }))
      .then((result) => {
        if (result.code) {
          setRequestData(result)
          return
        }
        console.log("Result", result)
        setRequestData(result)

      })
      .catch((err) => {
        console.log("ERROR", err)
      })


  }, [renderRequest])

  
  return (
    <>
      <Container fluid>
      
        <Row>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-chart text-warning"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Registered Users</p>
                      <Card.Title as="h4">{registerData.length}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>

                <Button className="stats" style={{ borderStyle: "none" }} onClick={() => { setRenderRegister(renderRegister ? false : true) }}>
                  <i className="fas fa-redo mr-1"></i>
                Update Now
                </Button>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-light-3 text-success"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Request</p>
                      <Card.Title as="h4">{requestData.length}</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <Button className="stats" style={{ borderStyle: "none" }} onClick={() => { setRenderRequest(renderRequest ? false : true) }}>
                  <i className="fas fa-redo mr-1"></i>
                Update Now
                </Button>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Errors</p>
                      <Card.Title as="h4">23</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <Button className="stats" style={{ borderStyle: "none" }} onClick={() => { }}>
                  <i className="fas fa-redo mr-1"></i>
                Update Now
                </Button>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg="3" sm="6">
            <Card className="card-stats">
              <Card.Body>
                <Row>
                  <Col xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary"></i>
                    </div>
                  </Col>
                  <Col xs="7">
                    <div className="numbers">
                      <p className="card-category">Total Rescue</p>
                      <Card.Title as="h4">25</Card.Title>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer>
                <hr></hr>
                <Button className="stats" style={{ borderStyle: "none" }}>
                  <i className="fas fa-redo mr-1"></i>
                Update Now
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>

        <Row>

          <Col md="4">
            <Card>
              <Card.Header>
                <Card.Title as="h4">User Statistics</Card.Title>
                <p className="card-category">Total users</p>
              </Card.Header>
              <Card.Body>
                <div
                  className="ct-chart ct-perfect-fourth"
                  id="chartPreferences"
                >
                  <ChartistGraph
                    data={{
                      labels: ["40%", "20%", "40%"],
                      series: [40, 20, 40],
                    }}
                    type="Pie"
                  />
                </div>
                <div className="legend">
                  <i className="fas fa-circle text-info"></i>
                  Total Users <i className="fas fa-circle text-danger"></i>
                  Users Request <i className="fas fa-circle text-warning"></i>
                  Disable Users
                </div>
                <hr></hr>
                <div className="stats">
                  <i className="far fa-clock"></i>
                  Updated 2 days ago
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>


        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
