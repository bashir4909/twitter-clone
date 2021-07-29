function appendTw(twUsername, twContent) {
  let dt = document.createElement("dt")
  dt.innerText = "@" + twUsername
  twList.appendChild(dt)
  let dd = document.createElement("dd")
  dd.innerText = twContent
  twList.appendChild(dd)
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
let fwButton = document.querySelector("#follow-button")

fetch(`http://localhost:3000/api/v1/tw/${username}`)
  .then(rows => rows.json())
  .then(rows => {
    rows.forEach((row) => {
      document.querySelector("#tweets").appendChild(
        mkTweetView(row.username, row.content)
      )
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

fetch(`/api/v1/u/${username}`)
  .then(row => row.json())
  .then(row =>
    document.querySelector("#user-view").appendChild(
      mkUserView(row.username, row.fullname, row.bio)
    ))