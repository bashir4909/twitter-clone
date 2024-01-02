function Login() {

    function handleLogin(evt) {
        evt.preventDefault()
        let [usernameField, passwordField, _, messageArea] = evt.target.children
        let username = usernameField.value;
        let password = passwordField.value;
        fetch("http://localhost:4000/users/login", {
            method: 'POST',
            headers:{
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                username: username, 
                password: password
            }),
            mode: 'cors',
            credentials: 'include'
            
        })
        .then(res => {
            console.log(res)
            return res.json()
        })
        .then(res => {
            console.log(res)
            if (res.message=="Login successful") {
                let addr = window.location.href.split("/")
                addr.pop()
                window.location.href = addr.join("/")
            } else {
                messageArea.innerText = res.message
            }
        })
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <input name="username" type="text" ></input>
                <input name="password" type="password"></input>
                <input type="submit" value="Submit" ></input>
                <p></p>
            </form>
        </div>
    )
}

export { Login };