let userlist = document.querySelector("#userlist > ul")
fetch("/api/v1/allusers")
  .then(rows => rows.json())
  .then(rows => {
    console.log(rows)
    rows.forEach((row) => {
      let a = document.createElement("a")
      a.setAttribute("href", `/user?username=${row.username}`)
      a.innerText = "@" + row.username
      let li = document.createElement("li")
      li.appendChild(a)
      userlist.appendChild(li)
    })
  })