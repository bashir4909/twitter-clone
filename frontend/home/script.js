let userid = readCookies()["userid"]
let loginform = document.querySelector("#login-form")
let loginformcontainer = document.querySelector("#login-form-container")
let timeline = document.querySelector("#timeline")
let twList = document.querySelector("#timeline > dl")

if (!readCookies()["userid"]) {
  document.querySelector("#main-page").setAttribute("hidden", "")
} else {
  document.querySelector("#login-form-container").setAttribute("hidden", "")
  fetch(`http://localhost:3000/api/v1/timeline`)
    .then(rows => rows.json())
    .then(rows => {
      rows.forEach((row) => {
        // appendTw(row.username, row.content)
        let twview = mkTweetView(row.username, row.content)
        twview.querySelector(".rt-button")
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
        document.querySelector("#timeline").appendChild(twview)
      })
    })
  document.querySelector("#new-tweet-form").appendChild(
    mkNewTweetForm()
  )
}