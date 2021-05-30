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
  Alert
} from "react-bootstrap";

import firebase from 'firebase/app'
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore"

function RequestList() {

  const [requestData, setRequestData] = useState([])
  const [render, setRender] = useState(false)

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


  }, [render])


  const reject = (id) => {
    console.log("Reject")
    fetch('http://localhost:3000/admin/requestDelete', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id:id
      })
    })
      .then((res => {
        return res.json()
      }))
      .then((result) => {
        if (result.success) {
          // console.log("Result", result)
          console.log("Deleted")
          setRender(render?false:true)
        }
        else{
          console.log("Failed")
        }
      })
      .catch((err) => {
        console.log("ERROR", err)
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
        id:id
      })
    })
      .then((res => {
        return res.json()
      }))
      .then((result) => {
        // if (result.success) {
        //   // console.log("Result", result)
        //   console.log("table")
        //   setRender(render?false:true)
        // }
        // else{
        //   console.log("Failed")
        // }
        console.log(result)
        firebase.auth().signInWithEmailAndPassword(result.email, result.password)
          .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log("USER", user)
            var user = firebase.auth().currentUser;
            user.sendEmailVerification().then(function () {
              // Email sent.
              console.log("Email Sent")
              firebase.auth()
              .signOut()
              .then(() => {
                console.log('User signed out!')
                reject(result.docId)
              });
            }).catch(function (error) {
              // An error happened.
              console.log("Email Error", error)
            });
            
          })
          .catch((error) => {
            console.log(error)
            var errorCode = error.code;
            var errorMessage = error.message;
          });
      })
      .catch((err) => {
        console.log("ERROR", err)
      })



  }
  

  return (
    <>
      <Container fluid>
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
                    {requestData.map((val, key) => (
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
