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
          mode:'cors',
          credentials:'include',
          body:JSON.stringify({
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

function Tweet({ profileImage, tweetText }) {
  return (
    <div className="tweet">
      <img src={profileImage} width={50} height={50}></img>
      <p className="tweetText">{tweetText}</p>
      <img src={replyArrow} width={25} height={25}></img>
      <img src={retweetArrow} width={25} height={25}></img>
    </div>
  );
}

function Timeline() {

  let array = [
    { profileImage: logo, tweetText: "Text 1" },
    { profileImage: logo, tweetText: "Text www" },
  ];
  array = array.concat(...[array, array, array]);
  return (
    <div>
      {array.map(item =>
        <Tweet
          profileImage={item.profileImage}
          tweetText={item.tweetText}
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
