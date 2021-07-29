function mkUserView(username, fullname, bio) {
  let card = document.createElement("div")
  card.classList.add("card")
  card.innerHTML = `
    <div class="card-header">
      <div class="card-header-title">
        <p>${fullname}</p>
        <small>{ @${username} }</small>
      </div>
    </div>
    <div class="card-content">
      <p>${bio}</p>
    </div>
    `
  return card
}

function mkTweetView(username, tweetcontent) {
  let media = document.createElement("div")
  media.classList.add("media")
  media.innerHTML = `
        <div class="media-left">
          <p class="image is-64x64">
            <img src="https://bulma.io/images/placeholders/128x128.png">
          </p>
        </div>
        <div class="media-content">
          <div class="content">
            <div class="columns">
              <div class="column">
                <p><a href="/user?username=${username}">@${username}:</a> ${tweetcontent}</p>
              </div>
              <div class="column is-narrow">
                <button class="button rt-button">rt</button>
                <button class="button">rp</button>
                <button class="button">qt</button>
              </div>

            </div>
          </div>
        </div>
    `
  return media
}

function mkNewTweetForm() {
  let lvl = document.createElement("div")
  lvl.classList.add("level")
  lvl.innerHTML = `
    <form action="/api/v1/newtweet" method='POST'>
      <div class="level-left">
        <textarea name="tweettext" cols="35" rows="2" placeholder="Enter your tweet" class="textarea has-fixed-size"></textarea>
      </div>
      <div class="level-right">
        <input type="submit" value="Tweet" class="button is-primary is-light is-rounded">
      </div>
    </form>
  `
  return lvl
}

function readCookies() {
  let cookies = {}
  document.cookie.split(";").forEach((pair) => {
    let kv = pair.split("=")
    cookies[kv[0].trim()] = kv[1]
  })
  return cookies
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

// document.querySelector(".columns > div").appendChild(
//   mkUserView("sissy", "mamamio", "go fuck yourself")
// )

// document.querySelector("#tweets > div").appendChild(
//   mkTweetView("bashir", "I have not tweeted for a while and my fingers are itching")
// )