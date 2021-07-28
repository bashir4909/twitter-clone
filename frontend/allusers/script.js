let userlist = document.querySelector("#userlist > ul")

function readCookies() {
  let cookies = {}
  document.cookie.split(";").forEach((pair) => {
    let kv = pair.split("=")
    cookies[kv[0]] = kv[1]
  })
  return cookies
}

fetch("/api/v1/allusers")
  .then(rows => rows.json())
  .then(rows => {
    console.log(rows)
    rows.forEach((row) => {
      let a = document.createElement("a")
      a.setAttribute("href", `/user?username=${row.username}`)
      a.innerText = "@" + row.username
      let span = document.createElement("span")

      let li = document.createElement("li")
      li.appendChild(a)
      li.appendChild(span)
        // Next part works, but need a lot of refactoring
      if (readCookies()["userid"]) {
        if (row.isfollow) {
          let fwbutton = document.createElement("button")
          fwbutton.addEventListener("click", (evt) => {
            fetch(`/api/v1/uid/${row.username}`)
              .then(row => row.json())
              .then(row => row.rowid)
              .then((followingid) => {
                let data = {
                  "followerid": readCookies()["userid"],
                  "followingid": followingid
                }
                console.log(data)
                fetch("/api/v1/unfollow", {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
                }).then((res) => {
                  window.location.reload()
                })
              })
          })
          span.innerText = "Following"
          fwbutton.innerText = "Unfollow"

          li.appendChild(fwbutton)
        } else {
          let fwbutton = document.createElement("button")
          fwbutton.addEventListener("click", (evt) => {
            fetch(`/api/v1/uid/${row.username}`)
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
                }).then((res) => {
                  window.location.reload()
                })
              })
          })
          span.innerText = "Not following"
          fwbutton.innerText = "Follow"
          li.appendChild(fwbutton)
        }
      }

      userlist.appendChild(li)

    })
  })