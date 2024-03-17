function User({ username, userUUID, isfollowing = false}) {

    function followUser() {
        fetch("http://localhost:4000/users/follow", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            mode: 'cors',
            credentials:'include',
            body: JSON.stringify({
                followingUUID : userUUID
            })
        }).then(_ => window.location.reload());
    }

    function unFollowUser() {
        fetch("http://localhost:4000/users/unfollow", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            mode: 'cors',
            credentials:'include',
            body: JSON.stringify({
                followingUUID : userUUID
            })
        }).then(_ => window.location.reload());
    }
    return (
        <div>
          <p>@{username}</p>
          {
              isfollowing ?
                  <button onClick={unFollowUser}>unfollow</button>
              :
              <button onClick={followUser}>follow</button>
          }
        </div>
    );
}

export {
    User
};
