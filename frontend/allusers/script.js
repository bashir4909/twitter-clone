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

      let userview = mkUserView(row.username, row.fullname, row.bio)

      if (readCookies()["userid"]) {
        // find the proper place to insert follow button
        // inside the element we just created
        if (row.isfollow) {
          userview
            .querySelector(".card-header")
            .appendChild(mkButton('/api/v1/unfollow', row.username, "Unfollow"))
        } else {
          userview
            .querySelector(".card-header")
            .appendChild(mkButton('/api/v1/follow', row.username, "Follow"))
        }
      }

      document.querySelector("#userlist").appendChild(userview)


    })
  })