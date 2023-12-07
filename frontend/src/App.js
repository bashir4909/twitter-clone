import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function NewTweet() {
  return (
    <div id="new-tweet" className="new-tweet-container">
      <img src="https://is2-ssl.mzstatic.com/image/thumb/Purple115/v4/26/bc/b8/26bcb8f6-43c0-f111-c69d-961b3670a34d/source/256x256bb.jpg" alt="" class="user-profile-photo"></img>
      <form action="/api/v1/newtweet" method="post">
        <input type="text" name="content" className="new-tweet-text-input"></input>
        <input type="submit" value="Tweet" className="new-tweet-submit"></input>
      </form>
    </div>
  )
}

function TweetView({ userName, content }) {
  return (
    <div className="tweet-view" id="000">
      <img src="https://is2-ssl.mzstatic.com/image/thumb/Purple115/v4/26/bc/b8/26bcb8f6-43c0-f111-c69d-961b3670a34d/source/256x256bb.jpg" alt="" className="user-profile-photo"></img>
      <p><i>{userName}</i> : <span>{content}</span></p>
      <button type="submit" className="rt-button">rt</button>
      <p className="rt-info"></p>
    </div>
  )
}

function UserTweets() {
  const [tweets, setTweets] = useState([]);
  // update tweets by fetching
  // setTimeout(()=>{setTweets([...tweets, {userName:"user", content:"content"}])}, 2000)
  return (
    <div id="user-tweets">
      <ul>
        {
          tweets.map(tw =>
            <li>
              <TweetView userName={tw.userName} content={tw.content} />
            </li>
          )
        }
      </ul>
    </div>
  )
}

function Home() {
  return (
    <div>
      <NewTweet />
      <UserTweets />
    </div>
  )
}

function App() {

  return (
    <Router>
      <div className="page-container">
        <header className="top-header">
          <div className="navbar-container">
            <nav>
              <ul>
                <li><a href="/home">HOME</a></li>
                <li><a href="/explore">EXPLORE</a></li>
                <li><a href="/u">PROFILE</a></li>
                <li>
                  <form action="/api/v1/logout" method="post">
                    <input type="submit" value="Logout"></input>
                  </form>
                </li>
              </ul>
            </nav>
          </div>

        </header >
        <Routes>
          <Route path='/home' element={<Home/>} />
        </Routes>
        {/* <Route path="/" component={App}></Route> */}
      </div >
    </Router>
  );
}

export default App;
