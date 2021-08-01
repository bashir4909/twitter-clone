function mkButton(posturl, username, btntext) {
  let btn = document.createElement("button")
  btn.addEventListener("click", (evt) => {
    fetch(`/api/v1/uid/${username}`)
      .then(row => row.json())
      .then(row => row.rowid)
      .then(followingid => {
        console.log(followingid)
        fetch(posturl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "followingid": followingid,
              "followerid": readCookies()["userid"]
            })
          })
          .then((res) => {
            window.location.reload()
          })
      })
  })
  btn.innerText = btntext
  btn.classList.add("button")
  btn.classList.add("is-small")
  btn.classList.add("is-rounded")
  btn.classList.add("media-right")
  return btn
}

function mkUserView(userdata) {
  let card = document.createElement("div")
  card.classList.add("card")
  card.innerHTML = `
    <div class="card-header">
      <div class="card-header-title">
        <p>${userdata.fullname}</p>
        <small><a href=/user?username=${userdata.username}>{ @${userdata.username} }</a></small>
      </div>
    </div>
    <div class="card-content">
      <p>${userdata.bio}</p>
    </div>
    `
  if (userdata.isfollow === 1) {
    card
      .querySelector(".card-header")
      .appendChild(mkButton('/api/v1/unfollow', userdata.username, "Unfollow"))
  } else if (userdata.isfollow === 0) {
    card
      .querySelector(".card-header")
      .appendChild(mkButton('/api/v1/follow', userdata.username, "Follow"))

  }
  return card
}

function mkTweetView(row) {
  let media = document.createElement("div")
  console.log(row)
  media.classList.add("media")
  media.innerHTML = `
        <div class="media-left">
          <p class="image is-64x64">
            <img src="https://bulma.io/images/placeholders/128x128.png">
          </p>
        </div>
        <div class="media-content">
          <div class="content">
            <div class="columns">
              <div class="column">
                <p><a href="/user?username=${row.username}">@${row.username}:</a> ${row.content}</p>
              </div>

            </div>
          </div>
          <nav class="level">
            <div class="level-left">
              <button class="level-item button rt-button">rt</button>
              <button class="level-item button">rp</button>
              <button class="level-item button">qt</button>
            </div>
            <div class="level-right">
              <small class="level-item rt-info"></small>
            </div>
          </nav>
        </div>
        </nav>
    `

  console.log(row.retweeterid)
  if (row.retweeterid === Number(readCookies()["userid"])) {
    media.querySelector(".rt-button").classList.add("is-light")
    media.querySelector(".rt-button").classList.add("is-primary")
    media
      .querySelector(".rt-button")
      .addEventListener('click', evt => {
        fetch('/api/v1/undoretweet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userid: readCookies()['userid'],
            tweetid: row.rowid
          })
        })
      })
  } else if (row.retweeter) {
    media
      .querySelector(".rt-info").innerText = `Retweet by ${row.retweeter}`
  } else {
    media
      .querySelector(".rt-button")
      .addEventListener('click', evt => {
        fetch('/api/v1/retweet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userid: readCookies()['userid'],
            tweetid: row.rowid
          })
        })
      })
  }

  return media
}

function mkNewTweetForm() {
  let lvl = document.createElement("div")
  lvl.classList.add("level")
  lvl.innerHTML = `
    <form action="/api/v1/newtweet" method='POST'>
      <div class="level-left">
        <textarea name="tweettext" cols="35" rows="2" placeholder="Enter your tweet" class="textarea has-fixed-size"></textarea>
      </div>
      <div class="level-right">
        <input type="submit" value="Tweet" class="button is-success is-rounded">
      </div>
    </form>
  `
  return lvl
}

function readCookies() {
  let cookies = {}
  document.cookie.split(";").forEach((pair) => {
    let kv = pair.split("=")
    cookies[kv[0].trim()] = kv[1]
  })
  return cookies
}

function parseGetParams() {
  let params = {}
  document.location.href
    .split("?")[1]
    .split(";").forEach((pair) => {
      kv = pair.split("=")
      params[kv[0]] = kv[1]
    })
  return params
}

// document.querySelector(".columns > div").appendChild(
//   mkUserView("sissy", "mamamio", "go fuck yourself")
// )

// document.querySelector("#tweets > div").appendChild(
//   mkTweetView("bashir", "I have not tweeted for a while and my fingers are itching")
// )