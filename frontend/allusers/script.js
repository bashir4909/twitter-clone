fetch("/api/v1/allusers")
  .then(rows => rows.json())
  .then(rows => {
    rows.forEach((row) => {
      document.querySelector("#userlist").appendChild(
        mkUserView(row)
      )
    })
  })