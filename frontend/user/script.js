function appendTw(twUsername, twContent) {
  let dt = document.createElement("dt")
  dt.innerText = "@" + twUsername
  twList.appendChild(dt)
  let dd = document.createElement("dd")
  dd.innerText = twContent
  twList.appendChild(dd)
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

function readCookies() {
  let cookies = {}
  document.cookie.split(";").forEach((pair) => {
    let kv = pair.split("=")
    cookies[kv[0]] = kv[1]
  })
  return cookies
}

let username = parseGetParams()["username"]
let twList = document.querySelector("#tweets > dl")
let fwButton = document.querySelector("#follow-button")

fetch(`http://localhost:3000/api/v1/u/${username}`)
  .then(rows => rows.json())
  .then(rows => {
    rows.forEach((row) => {
      console.log(row)
      appendTw(row.username, row.content)
    })
  })

fwButton.addEventListener("click", (evt) => {
  fetch(`/api/v1/uid/${username}`)
    .then(row => row.json())
    .then(row => row.rowid)
    .then((followingid) => {
      let data = {
        "followerid": readCookies()["userid"],
        "followingid": followingid
      }
      console.log(data)
      fetch("/api/v1/follow", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    })
})