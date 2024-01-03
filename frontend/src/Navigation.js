import './Navigation.css'

function logout(){
    fetch("http://localhost:4000/users/logout", {method:'POST', credentials:'include'})
    .then(res => {

        if (res.statusText==="OK") {
            let addr = window.location.href.split("/")
            addr.pop()
            window.location.href = addr.join("/")
        } else {
            console.log(res)
        }
    })
}

function Navigation() {
    return (
        <nav className="navigation-strip">
            <ul>
                <li>Home</li>
                <li>Explore</li>
                <li><button onClick={logout}>Logout</button></li>
            </ul>
        </nav>
    )
}

export default Navigation;