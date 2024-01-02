import './App.css';
import { Tweet, Timeline } from './Tweet.js';
import { Login } from './Login.js';
import Navigation from './Navigation.js';
import {
  createBrowserRouter,
  RouterProvider,
  redirect
} from 'react-router-dom'

let isLoggedIn = false;

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => {
      if (isLoggedIn) {
        return redirect("/home")
      } else {
        return redirect("/login")
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
