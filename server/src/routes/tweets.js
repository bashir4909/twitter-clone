import express from 'express';
import dotenv from 'dotenv';
import {
    initializeApp
} from 'firebase/app';
import {
    getFirestore,
    addDoc,
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    where,
    documentId,
} from 'firebase/firestore';

dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
}

const fbApp = initializeApp(firebaseConfig);
const fstore = getFirestore(fbApp);
var router = express.Router();

/* GET home page. */
router.post('/newtweet', async (req, res) => {
    let tweetAuthorUUID = req.session.uuid;
    let tweetContent = req.body.tweetContent;
    let date = new Date();
    let userDocRef = doc(fstore, 'users', tweetAuthorUUID);
    let user = await getDoc(userDocRef);
    if (!user.data()) {
        res.status(403);
        res.send("User not found");
    } else {
        let tweetDocRef = await addDoc(collection(fstore, 'tweets'), {
            authorUUID: tweetAuthorUUID,
            content: tweetContent,
            date: date
        });
        console.log(`Tweet reference -> ${tweetDocRef.id}`);
        res.status(200);
        res.send("Tweet sent");
    }
});

router.get('/timeline', async (req, res) => {
    let userDocRef = doc(fstore, 'users', req.session.uuid);
    let user = await getDoc(userDocRef);
    if (user) {
        let followlist = user.data()['following'] || [];

        let usernameRef = collection(fstore, 'users');
        let qUsers = query(usernameRef, where(documentId(), 'in', followlist));
        let usernameUUIDmapping = await getDocs(qUsers);

        usernameUUIDmapping = usernameUUIDmapping.docs.reduce((dictionary, row) => {
            let data = row.data();
            dictionary[row.id] = data["username"];
            return dictionary;
        }, {});

        console.log(usernameUUIDmapping);

        let tweetsRef = collection(fstore, 'tweets');
        let q = query(tweetsRef, where('authorUUID', "in", followlist));
        let tweets = await getDocs(q);
        let tweetsData = tweets.docs.map(row => row.data()).map(row => {
            return {
                ...row,
                "authorUUID": usernameUUIDmapping[row["authorUUID"]],
            };
        });
        res.status(200);
        res.json(tweetsData);
    } else {
        res.status(403);
        res.send("User not found");
    }
});

module.exports = router;
