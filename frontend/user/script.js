let username = parseGetParams()["username"]
let fwButton = document.querySelector("#follow-button")

fetch(`http://localhost:3000/api/v1/tw/${username}`)
  .then(rows => rows.json())
  .then(rows => {
    rows.forEach((row) => {
      document.querySelector("#tweets").appendChild(
        mkTweetView(row)
      )
    })
  })

fetch(`/api/v1/u/${username}`)
  .then(row => row.json())
  .then(row =>
    document.querySelector("#user-view").appendChild(
      mkUserView(row)
    ))