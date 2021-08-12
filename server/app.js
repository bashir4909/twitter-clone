const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const sqlite = require('sqlite3').verbose()
db = new sqlite.Database('mytwitter.db')

const cookieparser = require('cookie-parser')
const { response } = require('express')
app.use(cookieparser())

app.use(express.json())
app.use(express.urlencoded())
app.use("/", express.static("frontend"), )

app.post("/api/v1/login", (req, res) => {
  db.get(`
  SELECT rowid FROM user WHERE username is $username
  `, { $username: req.body.username }, (err, row) => {
    if (err) {
      console.log(err)
    } else if (!row) {
      res.redirect('back')
    } else {
      res.cookie("userid", row.rowid)
      res.redirect('back')
    }
  })
})

app.post("/api/v1/logout", (req, res) => {
  res.clearCookie("userid")
  res.redirect("/home")
})

app.post("/api/v1/newuser", (req, res) => {
  db.run(`
  INSERT INTO user (username, fullname, bio)
  VALUES ($username, $fullname, $bio)
  `, {
    $username: req.body.username,
    $fullname: req.body.fullname,
    $bio: req.body.bio
  })
  username2userid(req.body.username, (userid) => {
    res.cookie("userid", userid)
    res.redirect("/home")
  })
})

// Use following function to make queries using username
// instead of userid
function username2userid(username, callback, errorhandle) {
  db.get(`
  SELECT rowid FROM user WHERE username is $username
  `, {
    "$username": username
  }, (err, row) => {
    if (err) {
      console.log(err)
      res.send("Error logging in try again")
    } else if (!row) {
      errorhandle()
    } else {
      console.log(row.length)
    }
  })
}

app.get("/api/v1/uid/:username", (req, res) => {
  $username = req.params.username
  db.get(`
  SELECT rowid FROM user WHERE username IS $username
  `, { $username }, (err, row) => {
    console.log(row)
    res.json(row)
  })
})

app.get("/api/v1/u/:username", (req, res) => {
  if (req.cookies.userid) {
    db.get(`
  SELECT username, fullname, bio, 
  CASE WHEN rowid IN (SELECT followingid FROM follow WHERE followerid IS $userid) THEN 1 ELSE 0 END AS isfollow
  FROM user
  WHERE username IS $username
  `, {
      $username: req.params.username,
      $userid: req.cookies.userid
    }, (err, row) => {
      console.log(row)
      res.json(row)
    })
  } else {
    db.get(`
  SELECT username, fullname, bio, 
  FROM user
  WHERE username IS $username
  `, {
      $username: req.params.username
    }, (err, row) => {
      res.json(row)
    })
  }
})

app.get("/api/v1/following/:username", (req, res) => {
  db.get(
    `
    SELECT rowid FROM user WHERE username IS $username
    `, {
      $username: req.params.username
    }, (err, row) => {
      console.log(`FIRST:${row.rowid}`)
      db.all(`
        SELECT
          u.rowid,
          u.username
        FROM follow AS fw
        JOIN user AS u ON fw.followingid=u.rowid
        WHERE fw.followerid IS $uid
        `, {
        $uid: row.rowid
      }, (err, rows) => {
        res.json(rows)
      })
    }
  )
})

app.get("/api/v1/followers/:username", (req, res) => {
  db.get(
    `
    SELECT rowid FROM user WHERE username IS $username
    `, {
      $username: req.params.username
    }, (err, row) => {
      db.all(`
        SELECT
          u.rowid,
          u.username
        FROM follow AS fw
        JOIN user AS u ON fw.followerid=u.rowid
        WHERE fw.followingid IS $uid
        `, {
        $uid: row.rowid
      }, (err, rows) => {
        res.json(rows)
      })
    }
  )
})

app.get("/api/v1/tw/:username", (req, res) => {
  username2userid(req.params.username, (userid) => {
    console.log(userid)
      // Q: we do not really wanta username do we
    db.all(`
    SELECT content,username,tweet.rowid FROM tweet
    LEFT JOIN user ON tweet.userid=user.rowid
    WHERE userid IS $userid
    `, { "$userid": userid }, (err, rows) => {
      res.json(rows)
    })
  })
})

app.get("/api/v1/timeline", (req, res) => {

  // !TODO: this part is utter shit, use proper authorization
  let $userid = req.cookies.userid
  if (!$userid) {
    res.set(403)
    res.send("User not logged in")
  }

  db.all(`
SELECT 
    tw.rowid, 
    tw.content,
    user.username,
    tw.userid, 
    user.fullname,
    rtuser.username AS retweeter,
    rtuser.rowid AS retweeterid,
    tw.tweetdate,
    rt.retweetdate as odate
FROM tweet AS tw
INNER JOIN retweet AS rt ON rt.tweetid=tw.rowid
LEFT JOIN user ON tw.userid=user.rowid
LEFT JOIN user AS rtuser ON rt.userid=rtuser.rowid
WHERE rt.userid IN (SELECT followingid FROM follow WHERE followerid=$userid)
OR rt.userid IS $userid
UNION
SELECT 
    tw.rowid, 
    tw.content,
    user.username,
    tw.userid, 
    user.fullname,
    NULL AS retweeter,
    NULL AS retweeterid,
    tw.tweetdate,
    tw.tweetdate as odate
FROM tweet as tw
LEFT JOIN user ON tw.userid=user.rowid
WHERE tw.userid IN (SELECT followingid FROM follow WHERE followerid=$userid)
OR tw.userid IS $userid
ORDER BY odate DESC
  `, {
    $userid
  }, (err, rows) => {
    console.log(rows)
    res.json(rows)
  })
})

app.post('/api/v1/newtweet', (req, res) => {
  let $userid = req.cookies.userid
  let $tweettext = req.body.tweettext
  if ((!$userid) | (!$tweettext)) {
    res.send("Wrong request format")
  } else {
    db.run(`
      INSERT INTO tweet (content, userid, tweetdate)
      VALUES ( $tweettext, $userid, datetime('now') )
      `, {
      $tweettext,
      $userid
    }, (err) => {
      if (err) {
        console.log(err)
      } else {
        res.redirect("/home")
      }
    })
  }
})

app.post('/api/v1/retweet', (req, res) => {
  console.log(req.body)
  db.run(`
    INSERT INTO retweet (userid, tweetid, retweetdate)
    VALUES ($userid, $tweetid, datetime('now') )
  `, {
    $userid: req.cookies.userid,
    $tweetid: req.body.tweetid
  }, (err) => {
    console.log(err)
    res.send("success")
  })
})
app.post('/api/v1/undoretweet', (req, res) => {
  console.log(req.body)
  db.run(`
  DELETE FROM retweet
  WHERE userid IS $userid 
  AND tweetid IS $tweetid
  `, {
    $userid: req.cookies.userid,
    $tweetid: req.body.tweetid
  }, (err) => {
    console.log(err)
    res.send("success")
  })
})

app.post("/api/v1/follow", (req, res) => {
  let $followerid = Number(req.body.followerid)
  let $followingid = Number(req.body.followingid)
  let queryparams = {
    $followingid,
    $followerid
  }
  console.log(queryparams)
  db.run(`
    INSERT INTO follow (followerid, followingid)
    VALUES ($followerid, $followingid)
    `, queryparams, (err) => {
    if (err) { console.log(err) }

    res.send("Success")
  })
})

app.post("/api/v1/unfollow", (req, res) => {
  let $followerid = Number(req.body.followerid)
  let $followingid = Number(req.body.followingid)
  let queryparams = {
    $followingid,
    $followerid
  }
  console.log(queryparams)
  db.run(`
    DELETE FROM follow 
    WHERE followerid IS $followerid AND followingid IS $followingid
    `, queryparams, (err) => {
    if (err) { console.log(err) }

    res.send("Success")
  })
})

app.get("/api/v1/allusers", (req, res) => {
  if (req.cookies.userid) {
    let $userid = req.cookies.userid
    db.all(`
      SELECT 
          rowid,  
          username,
          fullname,
          bio,
          CASE WHEN rowid IN (SELECT followingid FROM follow WHERE followerid=$userid) THEN 1 ELSE 0 END AS isfollow
      FROM user
    `, { $userid }, (err, rows) => {
      res.json(rows)
    })
  } else {
    db.all(`
    SELECT username  FROM user
  `, (err, rows) => {
      res.json(rows)
    })
  }
})


app.listen(3000)