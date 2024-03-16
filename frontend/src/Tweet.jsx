import { useEffect, useState } from 'react';
import './Tweet.css';
import replyArrow from './assets/replyArrow.png';
import retweetArrow from './assets/retweetArrow.png';
import logo from './logo.svg';

function NewTweet({ }) {

  async function postNewTweet(evt) {

    evt.preventDefault();

    const [textAreaField, _] = evt.target.children;
    const tweetContent = textAreaField.value;

    let newTweetStatus = await fetch("http://localhost:4000/tweets/newtweet", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        tweetContent: tweetContent
      })
    });
  }

  return (
    <form className='new-tweet' onSubmit={postNewTweet}>
      <textarea></textarea>
      <input type='submit' value='submit'></input>
    </form>
  );
}

function Tweet({ profileImage, tweetAuthor, tweetText }) {
  return (
    <div className="tweet">
      <img src={profileImage} width={50} height={50}></img>
      <p className="tweetText"><b>@{tweetAuthor}</b> : {tweetText}</p>
      <img src={replyArrow} width={25} height={25}></img>
      <img src={retweetArrow} width={25} height={25}></img>
    </div>
  );
}

function Timeline() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/tweets/timeline", {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      },
      mode: 'cors',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(res => {
          setTweets(res);
      });
  }, []);

  return (
    <div className='timeline'>
      {tweets.map(item =>
        <Tweet
          profileImage={logo}
          tweetAuthor={item.authorUUID}
          tweetText={item.content}
        />
      )}
    </div>
  );
}

export {
  Tweet,
  Timeline,
  NewTweet
};
