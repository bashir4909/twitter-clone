--@block
INSERT INTO user (username, fullname, bio)
VALUES 
-- ("test_user1", "Test User1", "Robots are not biological");
-- ("test_user2", "Test User2", "beep boop, space, i am in space, spaceeee");
-- ("test_user3", "Test User3", "cats are cute according to my calculations");
-- ("test_user4", "Test User4", "death to all humanzzz, but change my oil first, plzz");

--@block
INSERT INTO tweet (content, userid, tweetdate)
VALUES ("i was practicing my stabs on the wall", 2, datetime('now'))

--@block
INSERT INTO follow (followerid, followingid)
VALUES (3, 1)

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
    FOREIGN KEY (followingid) REFERENCES user(rowid)
)

--@block
SELECT * FROM tweet
WHERE userid IN (SELECT followingid FROM follow WHERE followerid=3)
ORDER BY tweetdate DESC

--@block
SELECT rowid,* FROM user;

--@block
SELECT rowid, * FROM tweet;

--@block
SELECT datetime('now')