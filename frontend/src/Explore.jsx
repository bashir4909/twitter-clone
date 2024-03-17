import {User} from './User';
import { useEffect, useState } from 'react';

function Explore() {
    const [users, setUsers] = useState([]);

    useEffect( () => {
        fetch("http://localhost:4000/users/explore", {
            method: 'GET',
            mode: 'cors',
            credentials:'include',
            headers: {
                'Content-type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(res => setUsers(res));
    }, []);

    return (
        <div>
          {users.map(user =>
              <User
                username={user["username"]}
                userUUID={user["uuid"]}
                isfollowing={user["isFollowing"]}
              />
          )}
        </div>
    );
}

export {
    Explore
};
