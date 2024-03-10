
function User({ username, userUUID}) {
    function followUser() {
        fetch("https://localhost:4000/users/follow", {
            method: 'post',
            mode: 'cors',
            credentials:'include',
            body: {
                followingUUID : userUUID
            }
        });
    }
    return (
        <div>
            <p>@{username}</p>
            <button onClick={followUser}>follow</button>
        </div>
    );
}

export {User};
