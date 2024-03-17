import express from 'express';
import {
    initializeApp
} from "firebase/app";
import {
    getFirestore,
    addDoc,
    collection,
    getDoc,
    where,
    getDocs,
    query,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';
import dotenv from 'dotenv';
import {
    createHash
} from 'crypto';
import {
    post
} from '.';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

const fbApp = initializeApp(firebaseConfig);
const fstore = getFirestore(fbApp);
var router = express.Router();

function sha256hash(text) {
    return createHash('sha256').update(text).digest('hex');
}

router.get('/whoami', async (req, res) => {
    console.log(req.session);
    if (req.session.uuid === undefined) {
        res.send({
            'username': null
        });
    } else {
        let docRef = doc(fstore, 'users', req.session.uuid);
        let userDoc = await getDoc(docRef);
        if (userDoc) {
            res.json({
                'username': userDoc.data(0)['username']
            });
        } else {
            res.json({
                'username': null
            });
        }
    }
});

router.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let querySnapshot = await getDocs(query(collection(fstore, 'users'), where('username', "==", username)));
    if (querySnapshot.docs.length === 1) {
        let doc = querySnapshot.docs[0];
        let passwordHash = doc.data()['passwordHash'];
        if (passwordHash === sha256hash(password)) {
            req.session.uuid = doc.id;
            console.log(req.session);
            res.status(200);
            res.json({
                "message": "Login successful"
            });
        } else {
            res.status(200);
            res.json({
                "message": "Invalid password"
            });
        }
    } else {
        res.status(200);
        res.json({
            "message": "Login failed"
        });
    }

})

router.post('/logout', (req, res) => {
    req.session = null;
    res.send("OK");
})

router.post('/signup', async (req, res) => {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let passwordHash = sha256hash(password);
        let docRef = await addDoc(collection(fstore, 'users'), {
            username: username,
            passwordHash: passwordHash,
        });
        let _ = await updateDoc(docRef, {
            following: [docRef.id]
        });
        req.session.uuid = docRef.id;
        res.status(200);
        res.json({
            message: "Sign-up successful"
        });
    } catch (error) {
        res.status(404);
        res.json(error);
    }

});


/**
 *
 * @param {} follow
 * @param {followingUUID} req
 * @param {} res
 */
router.post('/follow', async (req, res) => {
    let userDocRef = doc(fstore, 'users', req.session.uuid);
    if (req.body.followingUUID !== undefined) {
        await updateDoc(userDocRef, {
            following: arrayUnion(req.body.followingUUID)
        });
        res.send("OK");
    } else {
        res.send("no followingUUID");
    }
});

router.post('/unfollow', async (req, res) => {
    let userDocRef = doc(fstore, 'users', req.session.uuid);
    if (req.body.followingUUID !== undefined) {
        await updateDoc(userDocRef, {
            following: arrayRemove(req.body.followingUUID)
        });
        res.send("OK");
    } else {
        res.send("no followingUUID");
    }
});

router.get('/explore', async (req, res) => {
    let users = await getDocs(collection(fstore, 'users'));
    let currentUser = await getDoc(doc(fstore, 'users', req.session.uuid));
    currentUser = currentUser.data();
    res.json(
        users.docs.map(row => {
            let {
                passwordHash,
                ...rowData
            } = {
                uuid: row.id,
                ...row.data()
            };
            if (currentUser["following"].includes(rowData["uuid"])) {
                rowData["isFollowing"] = true;
            } else {
                rowData["isFollowing"] = false;
            }
            return rowData;
        })
    );
});

module.exports = router;
