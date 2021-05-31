import React, { useState, useEffect } from "react";

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
  Alert, Spinner
} from "react-bootstrap";

import NotificationAlert from "react-notification-alert";
import firebase from 'firebase/app'
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore"

function RequestList() {

  const [requestData, setRequestData] = useState([])
  const [render, setRender] = useState(false)
  const [loading, setLoading] = useState(false)

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

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
    setLoading(true)
    fetch('http://localhost:3000/admin/request')
      .then((res => {
        return res.json()
      }))
      .then((result) => {
        if (result.code) {
          alert(result.message)

        } else {
          console.log("Result", result)
          setRequestData(result)
        }
        setLoading(false)

      })
      .catch((err) => {
        console.log("ERROR", err)
      })


  }, [render])


  const notificationAlertRef = React.useRef(null);
  const notify = (type, place, message) => {
    var options = {};
    options = {
      place: place,
      message: (
        <div>
          <div>
            {message}
          </div>
        </div>
      ),
      type: type,
      icon: "nc-icon nc-bell-55",
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };


  const reject = (id) => {
    console.log("Reject")
    fetch('http://localhost:3000/admin/requestDelete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    })
      .then((res => {
        return res.json()
      }))
      .then((result) => {
        if (result.success) {
          // console.log("Result", result)
          notify("success", "tr", "Account registration request has been rejected successfully")
          setRender(render ? false : true)
        }
        else {
          console.log("Failed")
          notify("danger", "tr", result.error.message)
        }
      })
      .catch((err) => {
        console.log("ERROR", err)
        notify("danger", "tr", err)
      })

  }

  const rejectAccepted = (id) => {
    console.log("Reject")
    fetch('http://localhost:3000/admin/requestDelete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    })
      .then((res => {
        return res.json()
      }))
      .then((result) => {
        if (result.success) {
          // console.log("Result", result)
          setRender(render ? false : true)
        }
        else {
          // console.log("Failed")
          notify("danger", "tr", result.error.message)
        }
      })
      .catch((err) => {
        // console.log("ERROR", err)
        notify("danger", "tr", err)
      })

  }

  const accept = (id) => {
    console.log("Accepted")
    fetch('http://localhost:3000/admin/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    })
      .then((res => {
        return res.json()
      }))
      .then((result) => {
        if (result.success) {
          console.log("Result", result)
          firebase.auth().signInWithEmailAndPassword(result.credential.email, result.credential.password)
            .then((userCredential) => {
              // Signed in
              var user = userCredential.user;
              console.log("USER", user)
              var user = firebase.auth().currentUser;
              user.sendEmailVerification()
                .then(function () {
                  // Email sent.
                  console.log("Email Sent")
                  firebase.auth()
                    .signOut()
                    .then(() => {
                      console.log('User signed out!')
                      notify("success", "tr", "Account registration request has been accepted successfully")
                      rejectAccepted(result.credential.docId)
                    });

                })
                .catch(function (error) {
                  // An error happened.
                  // console.log("Email Error", error)
                  notify("danger", "tr", error.message)
                });

            })
            .catch((error) => {
              console.log(error)
              notify("danger", "tr", error.message)
            });
        }
        else {
          console.log("Failed")
          notify("danger", "tr", result.error.message)
        }

      })
      .catch((err) => {
        notify("danger", "tr", err)
      })
  }




  return (
    <>
      <Container fluid>
        <NotificationAlert ref={notificationAlertRef} />
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Users Requests</Card.Title>
                <p className="card-category">
                  Here is a account registration requests list
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover table-striped" responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Doc Id</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email</th>
                      <th>Cnic Number</th>
                      <th>Phone Number</th>
                      <th>Blood Group</th>
                      <th>City</th>
                      <th>Country</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ?
                      <Spinner animation="border" role="status" style={{}}>
                        <span className="sr-only">Loading...</span>
                      </Spinner> : (requestData.length == 0) ?
                        <div style={{paddingTop:"50"}}>
                        <p className="card-category" >
                          <strong>There is no pending account register request</strong>
                        </p>
                        </div>
                        :
                        requestData.map((val, key) => (
                          <tr key={key}>
                            <td>{key}</td>
                            <td>{val.id}</td>
                            <td>{val.data.fname}</td>
                            <td>{val.data.lname}</td>
                            <td>{val.data.email}</td>
                            <td>{val.data.cnic}</td>
                            <td>{val.data.phoneNumber}</td>
                            <td>{val.data.bloodGroup}</td>
                            <td>{val.data.city}</td>
                            <td>{val.data.country}</td>
                            <td> <Button variant="success" onClick={() => { accept(val.id) }}>Accept</Button>{' '}
                              <Button variant="danger" onClick={() => { reject(val.id) }}>Reject</Button></td>
                          </tr>
                        ))}


                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
    </>
  );
}

export default RequestList;
