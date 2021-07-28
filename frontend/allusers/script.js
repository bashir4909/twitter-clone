let userlist = document.querySelector("#userlist > ul")

function readCookies() {
  let cookies = {}
  document.cookie.split(";").forEach((pair) => {
    let kv = pair.split("=")
    cookies[kv[0]] = kv[1]
  })
  return cookies
}

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


fetch("/api/v1/allusers")
  .then(rows => rows.json())
  .then(rows => {
    rows.forEach((row) => {

      let li = document.createElement("li")
      li.classList.add("media")

      let a = document.createElement("a")
      a.setAttribute("href", `/user?username=${row.username}`)
      a.innerText = "@" + row.username
      a.classList.add("media-left")

      li.appendChild(a)
        // Next part works, but need a lot of refactoring
      if (readCookies()["userid"]) {
        if (row.isfollow) {
          li.appendChild(mkButton('/api/v1/unfollow', row.username, "Unfollow"))
        } else {
          li.appendChild(mkButton('/api/v1/follow', row.username, "Follow"))
        }
      }

      userlist.appendChild(li)

    })
  })