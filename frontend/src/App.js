import './App.css';
import { Tweet, Timeline } from './Tweet.js';
import { Login, SignUp } from './Login.js';
import Navigation from './Navigation.js';
import {
  createBrowserRouter,
  RouterProvider,
  redirect
} from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    loader: async () => {
      let username = await fetch("http://localhost:4000/users/whoami", {credentials : 'include'}).then(res => res.json())
      username = username['username']
      console.log(username)
      if (username === null) {
        return redirect("/login")
      } else {
        return redirect("/home")
      }
    }
  },
  {
    path: '/home',
    element: <Timeline />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp/>
  }
])

function App() {
  return (
    <div className="App">
      <Navigation />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
