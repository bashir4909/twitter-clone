function readCookies() {
  let cookies = {}
  document.cookie.split(";").forEach((pair) => {
    let kv = pair.split("=")
    cookies[kv[0].trim()] = kv[1]
  })
  return cookies
}

function appendTw(twUsername, twContent) {
  let dt = document.createElement("dt")
  let a = document.createElement("a")
  a.setAttribute("href", `/userpage?username=${twUsername}`)
  a.innerText = "@" + twUsername
  dt.appendChild(a)
  let dd = document.createElement("dd")
  let p = document.createElement("p")
  p.innerText = twContent
  dd.appendChild(p)
    // parent div for bulma media
  let div = document.createElement("div")
  div.classList.add("media")
  dt.classList.add("media-left")
  dd.classList.add("media-right")
  p.classList.add("media-content")
  div.appendChild(dt)
  div.appendChild(dd)
  twList.appendChild(div)
}

function populateTweets() {
  fetch(`http://localhost:3000/api/v1/timeline`)
    .then(rows => rows.json())
    .then(rows => {
      rows.forEach((row) => {
        appendTw(row.username, row.content)
      })
    })
}
let userid = readCookies()["userid"]
let loginform = document.querySelector("#login-form")
let loginformcontainer = document.querySelector("#login-form-container")
let timeline = document.querySelector("#timeline")
let twList = document.querySelector("#timeline > dl")
if (!userid) {
  loginformcontainer.classList.add("is-active")
} else {
  populateTweets()
}