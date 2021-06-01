var express = require('express');
var router = express.Router();
var Admin = require('../models/admin');
var Class = require('../models/class');
var Teacher = require('../models/teacher');
var Student = require('../models/student');
var authenticate = require('../authenticate');
const cors = require('./cors');
var admin = require('firebase-admin');

/* GET Operations */
var serviceAccount = require("../safe-citizen-life-firebase-adminsdk-wj3ek-53dcd27039.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://safe-citizen-life-default-rtdb.asia-southeast1.firebasedatabase.app"
});

router.get('/', function (req, res, next) {
    res.send('respond with a Dashboard');

});
router.get('/email', function (req, res, next) {
    admin
        .auth()
        .getUserByEmail('ch.arham@yahoo.com')
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
            // res.send('respond with a user detail');
            res.send(userRecord)
        })
        .catch((error) => {
            console.log('Error fetching user data:', error);
        })
});
router.get('/users', function (req, res, next) {

    admin.firestore().collection("citizens").get().then((querySnapshot) => {
        let result = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            let object = { id: doc.id, data: doc.data() }
            result.push(object)
        });
        res.send(result)
    })
        .catch((error => {
            res.send(error)
        }))
});
router.get('/request', function (req, res, next) {

    admin.firestore().collection("apply").get().then((querySnapshot) => {
        let result = []
        querySnapshot.forEach((doc) => {
            let object = { id: doc.id, data: doc.data() }
            result.push(object)
        });
        res.send(result)
    })
        .catch((error => {
            res.send(error)
        }))
});
router.post('/requestDelete', function (req, res, next) {

    admin.firestore().collection("apply").doc(req.body.id).delete().then(() => {
        console.log("Document successfully deleted!");
        res.send({ success: true })
    }).catch((error) => {
        console.error("Error removing document: ", error);
        res.send({success:false,error:error})
    });
});

router.post('/userDelete', function (req, res, next) {
    admin
        .auth()
        .deleteUser(req.body.id)
        .then(() => {
            console.log('Successfully deleted user');
            res.send({ success: true })
        })
        .catch((error) => {
            console.log('Error deleting user:', error);
            res.send({ success: false, error: error })
        });
});

router.post('/userDisable', function (req, res, next) {
    console.log("abc")
    admin
        .auth()
        .getUser(req.body.id)
        .then((userRecord) => {
            console.log('Successfully fetch user', userRecord.toJSON());
            admin
                .auth()
                .updateUser(req.body.id, {
                    ...userRecord.toJSON(),
                    disabled: true,
                })
                .then((userRecord) => {
                    // See the UserRecord reference doc for the contents of userRecord.
                    console.log('Successfully updated user', userRecord.toJSON());
                    res.send({ success: true })
                })
                .catch((error) => {
                    console.log('Error updating user:', error);
                    console.log({ success: false, error: error })
                });
            
        })
        .catch((error) => {
            console.log('Error fetching user:', error);
            res.send({ success: false, error: error })
        });
});

router.post('/userEnable', function (req, res, next) {
    console.log("abc")
    admin
        .auth()
        .getUser(req.body.id)
        .then((userRecord) => {
            console.log('Successfully fetch user', userRecord.toJSON());
            admin
                .auth()
                .updateUser(req.body.id, {
                    ...userRecord.toJSON(),
                    disabled: false,
                })
                .then((userRecord) => {
                    // See the UserRecord reference doc for the contents of userRecord.
                    console.log('Successfully updated user', userRecord.toJSON());
                    res.send({ success: true })
                })
                .catch((error) => {
                    console.log('Error updating user:', error);
                    console.log({ success: false, error: error })
                });
            
        })
        .catch((error) => {
            console.log('Error fetching user:', error);
            res.send({ success: false, error: error })
        });
});

router.post('/create', function (req, res, next) {
    console.log(req.body)

    admin.firestore().collection("apply").doc(req.body.id).get().then((result) => {

        let object = { id: result.id, data: result.data() }
        admin
            .auth()
            .createUser({
                email: object.data.email,
                emailVerified: false,
                password: object.data.password,
                displayName: `${object.data.fname} ${object.data.lname}`,
                disabled: false,
            })
            .then((userRecord) => {

                admin.firestore().collection('citizens').doc(userRecord.uid)
                    .set({
                        fname: object.data.fname,
                        lname: object.data.lname,
                        email: object.data.email,
                        phoneNumber: object.data.phoneNumber,
                        address:object.data.address,
                        city: object.data.city,
                        country: object.data.country,
                        bloodGroup: object.data.bloodGroup,
                        cnic: object.data.cnic,
                        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
                        userImg: object.data.userImg,
                    })
                    .then(() => {
                        console.log("Document successfully written!");
                        let credential = { email: userRecord.email, password: object.data.password, docId: object.id }
                        console.log(credential)

                        res.send({ success: true, credential: credential })
                    })
                    .catch((error) => {
                        console.log("FireStore Admin", error)
                        res.send({ success: false, error: error })
                    })
            })
            .catch((error) => {
                console.log('Error creating new user:', error);
                res.send({ success: false, error: error })
            });
        // res.send(object)
    })
        .catch((error => {
            res.send({ success: false, error: error })
        }))
});
router.get('/list', function (req, res, next) {
    var usersList = []
    const listAllUsers = (nextPageToken) => {
        // List batch of users, 1000 at a time.
        admin
            .auth()
            .listUsers(1000, nextPageToken)
            .then((listUsersResult) => {
                listUsersResult.users.forEach((userRecord) => {
                    console.log('user', userRecord.toJSON());
                    usersList.push(userRecord.toJSON())
                    // res.send(userRecord)
                });
                // console.log("USERS LIST",usersList[0])
                res.send({success:true,result:usersList})
                if (listUsersResult.pageToken) {
                    // List next batch of users.
                    listAllUsers(listUsersResult.pageToken);
                }
            })
            .catch((error) => {
                console.log('Error listing users:', error);
                res.send({success:false,error:error})
                
            });
    };
    // Start listing users from the beginning, 1000 at a time.
    listAllUsers();
});

module.exports = router;