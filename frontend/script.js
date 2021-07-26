const rootURL = "https://localhost:3000/home"

window.addEventListener("load", (evt) => {
  let divTweets = document.querySelector("#tweets")
  fetch(rootURL)
    .then((res) => {
      console.log(res)
    })
})