import "./Login.css"

function Login() {

    function handleLogin(evt) {
        evt.preventDefault();
        let [usernameField, passwordField, _, messageArea] = evt.target.children;
        let username = usernameField.value;
        let password = passwordField.value;
        fetch("http://localhost:4000/users/login", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            mode: 'cors',
            credentials: 'include'
        }).then(res => {
            console.log(res);
            return res.json();
        }).then(res => {
            console.log(res)
            if (res.message == "Login successful") {
                let addr = window.location.href.split("/");
                addr.pop();
                window.location.href = addr.join("/");
            } else {
                messageArea.innerText = res.message;
            }
        });
    }

    return (
        <div className="cont">
            <form onSubmit={handleLogin} className="form">
                <input name="username" type="text" className="user" ></input>
                <input name="password" type="password" className="pass"></input>
                <input type="submit" value="Submit" className="login"></input>
                <p></p>
            </form>
            <p>Or you can <a href="/signup">create user</a></p>
        </div>
    );
}

function SignUp() {

    function handleSignUp(evt) {
        evt.preventDefault();
        let [usernameField, passwordField, passwordConfirmField, _, messageArea] = evt.target.children;
        let username = usernameField.value;
        let password = passwordField.value;
        let passwordConfirm = passwordConfirmField.value;
        if (password === passwordConfirm) {
            fetch("http://localhost:4000/users/signup", {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                }),
                mode: 'cors',
                credentials: 'include'

            })
                .then(res => {
                    console.log(res);
                    return res.json();
                })
                .then(res => {
                    console.log(res)
                    if (res.message == "Sign-up successful") {
                        let addr = window.location.href.split("/");
                        addr.pop();
                        window.location.href = addr.join("/");
                    } else {
                        messageArea.innerText = res.message;
                    }
                });
        } else {
            messageArea.innerText = "passwords do not match";
        }
    }

    return (
        <div>
            <form onSubmit={handleSignUp} className=".signup-form">
                <input name="username" type="text" ></input>
                <input name="password" type="password"></input>
                <input name="passwordConfirm" type="password"></input>
                <input type="submit" value="Submit" ></input>
                <p></p>
            </form>
            <p>Already have account? <a href="/login">login here</a></p>
        </div>
    );
}

export { Login, SignUp };
