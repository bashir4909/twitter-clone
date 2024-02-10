--@block
INSERT INTO user (username, fullname, bio)
VALUES 
    ("rickymicky", "Ricky Micky", "Robots are not biological");
-- ("test_user2", "Test User2", "beep boop, space, i am in space, spaceeee");
-- ("test_user3", "Test User3", "cats are cute according to my calculations");
-- ("test_user4", "Test User4", "death to all humanzzz, but change my oil first, plzz");

--@block
INSERT INTO tweet (content, userid, tweetdate)
VALUES ("Just realized I havent tweeted at all :D ", 3, datetime('now'))

--@block
INSERT INTO follow (followerid, followingid)
VALUES 
    (2, 4);

--@block
CREATE TABLE user (
    username TEXT UNIQUE NOT NULL,
    fullname TEXT,
    bio TEXT
);

--@block
CREATE TABLE tweet (
    content TEXT,
    userid INTEGER NOT NULL,
    tweetdate TEXT NOT NULL,
    FOREIGN KEY (userid) REFERENCES user(rowid)
)

--@block
CREATE TABLE follow (
    followerid INTEGER,
    followingid INTEGER,
    FOREIGN KEY (followerid) REFERENCES user(rowid),
    FOREIGN KEY (followingid) REFERENCES user(rowid),
    UNIQUE (followerid, followingid)
)

--@block
CREATE TABLE retweet (
    userid INTEGER NOT NULL,
    tweetid INTEGER NOT NULL,
    retweetdate TEXT NOT NULL,
    FOREIGN KEY (userid) REFERENCES user(rowid),
    FOREIGN KEY (tweetid) REFERENCES tweet(rowid),
    UNIQUE (userid, tweetid)
)

--@block
CREATE TABLE reply (
    parent INTEGER,
    child INTEGER,
    FOREIGN KEY (parent) REFERENCES tweet(rowid),
    FOREIGN KEY (child) REFERENCES tweet(rowid),
    UNIQUE (child) -- a reply tweet can reply to only one tweet
)

--@block
SELECT tweet.rowid, content, username, userid, fullname, tweetdate FROM tweet
LEFT JOIN user ON tweet.userid=user.rowid
WHERE userid IN (SELECT followingid FROM follow WHERE followerid=3) 
OR userid IS 3 
OR tweet.rowid IN (SELECT tweetid FROM retweet WHERE userid IN (SELECT followingid FROM follow WHERE followerid=3))
ORDER BY tweetdate DESC
--@block
SELECT 
    tw.rowid, 
    tw.content,
    user.username,
    tw.userid, 
    user.fullname,
    rtuser.username AS retweeter,
    rtuser.rowid AS retweeterid,
    tw.tweetdate,
    rt.retweetdate as odate
FROM tweet AS tw
INNER JOIN retweet AS rt ON rt.tweetid=tw.rowid
LEFT JOIN user ON tw.userid=user.rowid
LEFT JOIN user AS rtuser ON rt.userid=rtuser.rowid
WHERE rt.userid IN (SELECT followingid FROM follow wHERE followerid=3)
UNION
SELECT 
    tw.rowid, 
    tw.content,
    user.username,
    tw.userid, 
    user.fullname,
    NULL AS retweeter,
    NULL AS retweeterid,
    tw.tweetdate,
    tw.tweetdate as odate
FROM tweet as tw
LEFT JOIN user ON tw.userid=user.rowid
WHERE tw.userid IN (SELECT followingid FROM follow WHERE followerid=3)
AND tw.rowid NOT IN (SELECT child FROM reply) -- Do not show replies
ORDER BY odate DESC

--@block
SELECT content, userid 
FROM tweet
WHERE userid IS 1
ORDER BY tweetdate DESC

--@block
SELECT rowid FROM tweet WHERE userid IS '3';

--@block
SELECT rowid, * FROM user;

--@block
SELECT datetime('now')

--@block
SELECT rowid,* FROM user

--@block
SELECT 
    rowid,  
    username,
    CASE WHEN rowid IN (SELECT followingid FROM follow WHERE followerid=7) THEN 1 ELSE 0 END AS isfollow
FROM user

--@block
SELECT 
  *, 
  CASE WHEN rowid IN (SELECT followingid FROM follow WHERE followerid IS 5) THEN 1 ELSE 0 END AS isfollow,
  (SELECT COUNT(fw.rowid) FROM follow AS fw LEFT JOIN user AS u ON fw.followerid=u.rowid WHERE u.username IS 'rick')
FROM user 
WHERE username IS "rick"

--@block
    SELECT 
      *, 
      CASE WHEN rowid IN (SELECT followingid FROM follow WHERE followerid IS 5) THEN 1 ELSE 0 END AS isfollow,
      (SELECT COUNT(fw.rowid) FROM follow AS fw LEFT JOIN user AS u ON fw.followerid=u.rowid WHERE u.username IS 'rick') AS followingcount,
      (SELECT COUNT(fw.rowid) FROM follow AS fw LEFT JOIN user AS u ON fw.followingid=u.rowid WHERE u.username IS 'rick') AS followercount
    FROM user 
    WHERE username IS 'rick'

--@block
    SELECT 
      *, 
      CASE WHEN u.rowid IN (SELECT followingid FROM follow WHERE followerid IS 5) THEN 1 ELSE 0 END AS isfollow,
      COUNT(fw.rowid),
      COUNT(fww.rowid)
    FROM user AS u
    LEFT JOIN follow as fw ON fw.followerid=u.rowid
    LEFT JOIN follow as fww ON fww.followingid=u.rowid
    WHERE u.username is 'rick'
--@block
SELECT uu.username
FROM follow fw
LEFT JOIN user AS u ON fw.followingid=u.rowid
LEFT JOIN user AS uu ON fw.followerid=uu.rowid
WHERE u.username IS 'rick'
--@block
SELECT uu.username
FROM follow fw
LEFT JOIN user AS u ON fw.followerid=u.rowid
LEFT JOIN user AS uu ON fw.followingid=uu.rowid
WHERE u.username IS 'rick'

--@block
SELECT username
FROM user
WHERE rowid NOT IN (SELECT followingid FROM follow WHERE followerid IS 8) 

--@block
SELECT 
    name
FROM 
    sqlite_schema
WHERE 
    type ='table' AND 
    name NOT LIKE 'sqlite_%';