import logo from './logo.svg';
import './App.css';
import Tweet from './Tweet.js';

function App() {
  let array = [
    { profileImage: logo, tweetText: "Text 1" },
    { profileImage: logo, tweetText: "Text www" },
  ]
  return (

    <div className="App">
      {array.map(item => 
        <Tweet
          profileImage={item.profileImage}
          tweetText={item.tweetText}
        />
      )}
    </div>
  );
}

export default App;
