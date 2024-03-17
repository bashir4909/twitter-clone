import './App.css';
import { Tweet, Timeline, NewTweet } from './Tweet';
import { Login, SignUp } from './Login';
import { Explore } from './Explore';
import { Navigation} from './Navigation';
import {
    createBrowserRouter,
    RouterProvider,
    redirect
} from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: "/",
        loader: async () => {
            let username = await fetch("http://localhost:4000/users/whoami", { credentials: 'include' }).then(res => res.json());
            username = username['username'];
            console.log(username);
            if (username === null) {
                return redirect("/login");
            } else {
                return redirect("/home");
            }
        }
    },
    {
        path: '/home',
        element: <TimelineNewTweetContainer />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/signup',
        element: <SignUp />
    },
    {
        path : '/explore',
        element: <Explore/>
  }
])

function TimelineNewTweetContainer() {
  return (
    <div>
      <NewTweet />
      <Timeline />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Navigation />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
