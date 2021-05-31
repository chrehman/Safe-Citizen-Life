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

function UsersList() {

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
        fetch('http://localhost:3000/admin/list')
            .then((res => {
                return res.json()
            }))
            .then((result) => {
                if (result.success) {
                    setRequestData(result.result)
                }
                else {
                    alert(result.error.message)
                }
                setLoading(false)
            })
            .catch((err) => {
                console.log("ERROR", err)
                alert(err.message)
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


    const deleteUser = (id) => {
        console.log("Reject")
        fetch('http://localhost:3000/admin/userDelete', {
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
                    // console.log("Deleted")
                    // alert("Account has been deleted")
                    notify("success", "tr", "Account has been accepted deleted successfully")
                    setRender(render ? false : true)
                }
                else {
                    console.log("Failed")
                    // console.log(result.error.message)
                    // alert(error)
                    notify("danger", "tr", result.error.message)
                }
            })
            .catch((err) => {
                // console.log("ERROR", err)
                // alert(err)
                notify("danger", "tr", err)
            })

    }

    const disableUser = (id) => {
        console.log("Accepted")
        fetch('http://localhost:3000/admin/userDisable', {
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
                    // console.log("Hi")
                    // alert("User account has been disabled successfully")
                    notify("success", "tr", "User account has been disabled successfully")
                    setRender(render ? false : true)
                }
                else {
                    // console.log("Failed")
                    // alert(result.error.message)
                    notify("danger", "tr", result.error.message)
                }

            })
            .catch((err) => {
                // console.log("ERROR", err)
                // alert(err.message)
                notify("danger", "tr", err)
            })

    }

    const enableUser = (id) => {
        console.log("Accepted")
        fetch('http://localhost:3000/admin/userEnable', {
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
                    console.log("Hi")
                    // alert("User account has been enabled successfully")
                    notify("success", "tr", "User account has been enabled successfully")
                    setRender(render ? false : true)
                }
                else {
                    // console.log("Failed")
                    // alert(result.error.message)
                    notify("danger", "tr", result.error.message)
                }
            })
            .catch((err) => {
                // console.log("ERROR", err)
                // alert(err.message)
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
                                <Card.Title as="h4">Registered Users</Card.Title>
                                <p className="card-category">
                                    Here is a list of registered users
                                </p>
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Table className="table-hover table-striped" responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>User Id</th>
                                            <th>Full Name</th>
                                            <th>Email</th>
                                            <th>Email Verified</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ?
                                            <Spinner animation="border" role="status" style={{}}>
                                                <span className="sr-only">Loading...</span>
                                            </Spinner> : (requestData.length == 0) ?
                                                <div style={{ paddingTop: "50" }}>
                                                    <p className="card-category" >
                                                        <strong>There is no user registered in app</strong>
                                                    </p>
                                                </div>
                                                :
                                                requestData.map((val, key) => (
                                                    <tr key={key}>
                                                        <td>{key}</td>
                                                        <td>{val.uid}</td>
                                                        <td>{val.displayName}</td>
                                                        <td>{val.email}</td>
                                                        <td>{String(val.emailVerified)}</td>
                                                        {val.disabled ? <td> <Button variant="success" onClick={() => { enableUser(val.uid) }}>Enable Account</Button>{' '}
                                                            <Button variant="danger" onClick={() => { deleteUser(val.uid) }}>Delete Account</Button></td>
                                                            :
                                                            <td> <Button variant="success" onClick={() => { disableUser(val.uid) }}>Disable Account</Button>{' '}
                                                                <Button variant="danger" onClick={() => { deleteUser(val.uid) }}>Delete Account</Button></td>}
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

export default UsersList;
