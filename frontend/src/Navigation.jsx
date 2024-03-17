import './Navigation.css';

async function logout() {
    let logoutResponse = await fetch("http://localhost:4000/users/logout", { method: 'POST', credentials: 'include' })
        .then(res => {

            if (res.statusText === "OK") {
                let addr = window.location.href.split("/");
                addr.pop();
                window.location.href = addr.join("/");
            } else {
                console.log(res);
            }
        });
    console.log(logoutResponse);
}

function Navigation() {
    return (
        <nav className="navigation-strip">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/explore">Explore</a></li>
            <li><button onClick={logout}>Logout</button></li>
          </ul>
        </nav>
    );
}

export {
    Navigation
};
