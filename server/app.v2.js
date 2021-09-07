const express = require('express')
const app = express()

const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'user-session',
  secret: 'yo-mama'
}))

const cors = require('cors')
app.use(cors())

const sqlite = require('sqlite3').verbose()
db = new sqlite.Database('mytwitter.db')

// const cookieparser = require('cookie-parser')
// app.use(cookieparser(
// 
// ))

app.use(express.json())
app.use(express.urlencoded())

// ===> Website logic <=== //

// STATIC pages to serve
app.use("/home", express.static("frontendv2/home.html"), )
app.use("/signup", express.static("frontendv2/signup.html"), )
app.use("/explore", express.static("frontendv2/explore.html"), )
app.use("/u/:username", express.static("frontendv2/user.html"))
app.use("/u/:username/follower", express.static("frontendv2/user.html"))
app.use("/u/:username/following", express.static("frontendv2/user.html"))
app.use("/login", express.static("frontendv2/login.html"))
app.use("/common.css", express.static("frontendv2/common.css"))

app.get("/u", (req, res) => {
  $id = req.session.userid
  db.get("SELECT username FROM user WHERE rowid IS $id", { $id }, (err, row) => {
    if (err) { console.log(err) }
    if (row) { res.redirect("/u" + "/" + row.username) } else { res.redirect("/") }
  })
})

// app.use("/login", (req, res, next) => {
// if (req.session) {
// res.redirect("/")
// next()
// } else {
// express.static("frontendv2/login.html")
// }
// })

// app.use("/login", express.static("frontendv2/login.html"), ) // What if user goes to /login directly? need to handle that somehow, ideally redireact to "/"

// AUX

function isLoggedIn($id, cb_true, cb_false) {
  db.get(`
  SELECT * FROM user WHERE rowid IS $id
  `, { $id }, (err, row) => {
    if (err) { console.log(err) }
    if (row) {
      cb_true()
    } else {
      cb_false()
    }
  })
}

//ROOT ENTRY
app.use("/$", (req, res) => {
  if (!req.session) {
    res.redirect("/login")
  } else {
    isLoggedIn(req.session.userid, () => res.redirect('/home'), () => { res.redirect('/login') })
      //   db.get(`
      // SELECT * FROM user WHERE rowid IS $id
      // `, { $id: req.session.userid }, (err, row) => {
      //     if (err) { console.log(err) }
      //     if (row) {
      //       res.redirect("/home")
      //     } else {
      //       res.redirect("/login")
      //     }
      //   })
  }
})

// userpage

// ===> API endpoints <=== //

// user session handling LOGIN/LOGOUT/SIGNUP

app.post("/api/v1/login", (req, res) => {
  console.log("===> REQUEST: LOGIN")
  $username = req.body.username
  let query = "SELECT rowid FROM user WHERE username IS $username"
  db.get(query, { $username }, (err, row) => {
    if (err) { console.log(err) }
    if (row) { req.session.userid = row.rowid }
    res.redirect("/")
  })
})



app.post("/api/v1/logout", (req, res) => {
  console.log("==> REQUEST: LOGOUT")
  req.session = null
  res.redirect("/")
})

app.get("/api/v1/islogged", (req, res) => {
  let sessdata = req.session.userid
  isLoggedIn(req.session.userid, () => res.json({ "login": true }), () => res.json({ "login": false }))
})

// For viewing user page
app.get("/api/v1/u/:username", (req, res) => {
  let $username = req.params.username
  var query
  var $viewerid
    // Decrease the no of lines
  if (req.session) {
    $viewerid = req.session.userid
    query = `
    SELECT 
      *, 
      CASE WHEN rowid IN (SELECT followingid FROM follow WHERE followerid IS $viewerid) THEN 1 ELSE 0 END AS isfollow,
      (SELECT COUNT(fw.rowid) FROM follow AS fw LEFT JOIN user AS u ON fw.followerid=u.rowid WHERE u.username IS $username) AS followercount,
      (SELECT COUNT(fw.rowid) FROM follow AS fw LEFT JOIN user AS u ON fw.followingid=u.rowid WHERE u.username IS $username) AS followingcount
    FROM user 
    WHERE username IS $username
    `
    db.get(query, { $username, $viewerid }, (err, row) => {
      if (err) { console.log(err) }
      if (row) {
        res.json(row)
      } else {
        res.send(`user ${$username} not found`)
      }
    })
  } else {
    query = "SELECT * FROM user WHERE username IS $username"
    db.get(query, { $username }, (err, row) => {
      if (err) { console.log(err) }
      if (row) {
        res.json(row)
      } else {
        res.send(`user ${$username} not found`)
      }
    })
  }

})

app.get("/api/v1/tw/:username", (req, res) => {
  let query = "SELECT * FROM tweet AS tw LEFT JOIN user ON user.rowid=tw.userid WHERE username IS $username"
  let $username = req.params.username
  db.all(query, { $username }, (err, rows) => {
    if (err) { console.log(err) }
    if (rows) {
      res.json(rows)
    } else {
      res.send(`user ${$username} not found`)
    }
  })
})

app.get("/api/v1/u/:username/following", (req, res) => {
  console.log(`==> REQUEST: followings for ${req.params.username}`)
  db.all(`
SELECT uu.username
FROM follow fw
LEFT JOIN user AS u ON fw.followingid=u.rowid
LEFT JOIN user AS uu ON fw.followerid=uu.rowid
WHERE u.username IS $username
  `, { $username: req.params.username }, (err, rows) => {
    if (err) { console.log(err) }
    if (rows) { res.json(rows) } else { res.json([]) }
  })
})

app.get("/api/v1/u/:username/follower", (req, res) => {
  console.log(`==> REQUEST: followers for ${req.params.username}`)
  db.all(`
  SELECT uu.username
  FROM follow fw
  LEFT JOIN user AS u ON fw.followerid=u.rowid
  LEFT JOIN user AS uu ON fw.followingid=uu.rowid
  WHERE u.username IS $username
    `, { $username: req.params.username }, (err, rows) => {
    if (err) { console.log(err) }
    if (rows) { res.json(rows) } else { res.json([]) }
  })
})

// follow/unfollow
app.delete("/api/v1/:username/unfollow", (req, res) => {
  console.log(`==>REQUEST: unfollow ${req.params.username}`)
  db.run(`
  DELETE FROM follow
  WHERE followerid IS $followerid
  AND followingid IS (SELECT rowid FROM user WHERE username IS $followingname)
  `, {
    $followerid: req.session.userid,
    $followingname: req.params.username
  }, (err) => {
    if (err) {
      console.log(err);
      res.send("FAIL")
    } else {
      res.send("OK")
    }
  })
})

app.post("/api/v1/:username/follow", (req, res) => {
  console.log(`==>REQUEST: follow ${req.params.username}`)
  db.run(`
  INSERT INTO follow (followerid, followingid)
  VALUES
    ($followerid, (SELECT rowid FROM user WHERE username IS $followingname))
  `, {
    $followerid: req.session.userid,
    $followingname: req.params.username
  }, (err) => {
    if (err) {
      console.log(err);
      res.send("FAIL")
    } else {
      res.send("OK")
    }
  })
})

// tweet / retweet
app.post("/api/v1/newtweet", (req, res) => {
  let $id = req.session.userid
  let $twtText = req.body.content
  db.run(`
  INSERT INTO tweet (content, userid, tweetdate)
  VALUES ($twtText, $id, datetime('now'))
  `, { $id, $twtText }, (err) => {
    if (err) { console.log(err) }
    res.redirect("back")
  })
})

app.post("/api/v1/retweet", (req, res) => {
  $id = req.session.userid
  $tweetid = req.body.tweetid
  db.run(`
  INSERT INTO retweet (userid, tweetid, retweetdate)
  VALUES ($id, $tweetid, datetime('now'))
  `, { $id, $tweetid }, (err) => {
    if (err) { console.log(err) }
    res.redirect('back')
  })
})
app.post("/api/v1/undoretweet", (req, res) => {
    $id = req.session.userid
    $tweetid = req.body.tweetid
    db.run(`
  DELETE FROM retweet 
  WHERE userid IS $id
  AND tweetid IS $tweetid
  `, { $id, $tweetid }, (err) => {
      if (err) { console.log(err) }
      res.redirect('back')
    })
  })
  // MISCALLENOUS
app.get("/api/v1/timeline", (req, res) => {
  let $id = req.session.userid
  console.log(`==> REQUEST: timeline for userid: ${$id}`)
  isLoggedIn($id, () => {
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
WHERE rt.userid IN (SELECT followingid FROM follow WHERE followerid=$id)
OR rt.userid IS $id
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
WHERE tw.userid IN (SELECT followingid FROM follow WHERE followerid=$id)
OR tw.userid IS $id
ORDER BY odate DESC
  `, {
      $id
    }, (err, rows) => {
      // console.log(rows)
      res.json(rows)
    })
  }, () => res.json([]))
})

app.get("/api/v1/suggest", (req, res) => {
  $id = req.session.userid
  db.all(`
  SELECT username
  FROM user
  WHERE rowid NOT IN (SELECT followingid FROM follow WHERE followerid IS $id) 
  `, { $id }, (err, rows) => {
    if (err) { console.log(err) }
    res.json(rows)
  })
})

app.get("/api/v1/whoami", (req, res) => {
  $id = req.session.userid
  db.get(`
  SELECT username
  FROM user
  WHERE rowid IS $id
  `, { $id }, (err, row) => {
    if (err) { console.log(err) }
    res.json(row)
  })
})

app.listen(3000)