import express from 'express';
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, getDoc, where, getDocs, query, doc } from 'firebase/firestore';
import dotenv from 'dotenv';
import { createHash } from 'crypto';

dotenv.config()

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const fbApp = initializeApp(firebaseConfig);
const fstore = getFirestore(fbApp)
var router = express.Router();

function sha256hash(text) {
  return createHash('sha256').update(text).digest('hex')
}

router.get('/whoami', async (req, res) => {
  if (req.session.uuid === undefined) {
    res.send({
      'username' : null
    })
  } else {
    let docRef = doc(fstore, 'users', req.session.uuid)
    let userDoc = await getDoc(docRef)
    if (userDoc) {
      res.json({
        'username' : userDoc.data(0)['username']
      })
    } else {
      res.json({
        'username':null
      })
    }
  }
})

router.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let querySnapshot = await getDocs(query(collection(fstore, 'users'), where('username', "==", username)))
  if (querySnapshot.docs.length === 1) {
    let doc = querySnapshot.docs[0]
    let passwordHash = doc.data()['passwordHash']
    if (passwordHash === sha256hash(password)) {
      console.log(doc.id)
      req.session.uuid = doc.id
      res.status(200)
      res.json({
        "message" : "Login successful"
      })
    } else {
      res.status(200)
      res.json({
        "message" : "Invalid password"
      })
    }
  } else {
    res.status(200)
    res.json({
      "message" : "Login failed"
    })
  }

})

router.post('/signup', async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;
    let passwordHash = sha256hash(password)
    let docRef = await addDoc(collection(fstore, 'users'), {
      username: username,
      passwordHash: passwordHash
    })
    req.session.uuid = docRef.id
    res.status(200)
    res.json({
      'message' : "Sign-up successful"
    })
  } catch (error) {
    res.status(404)
    res.json(error)
  }

})

module.exports = router;
