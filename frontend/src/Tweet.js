import './Tweet.css'
import replyArrow from './assets/replyArrow.png'
import retweetArrow from './assets/retweetArrow.png'

function Tweet({profileImage, tweetText}) {
    return (
        <div className="tweet">
            <img src={profileImage} width={50} height={50}></img>
            <p className="tweetText">{tweetText}</p>
            <img src={replyArrow} width={25} height={25}></img>
            <img src={retweetArrow} width={25} height={25}></img>
        </div>
    )
}

export default Tweet;