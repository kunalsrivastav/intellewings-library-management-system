import Books from "./components/books/books.component";
import CreateBook from "./components/books/create-book.component";
import MyBooks from "./components/books/my-books.component";
import Dashboard from "./components/dashboard/dashboard.component";
import Login from "./components/login/login.component";
import Signup from "./components/signup/signup.component";
import FourOhFour from "./components/four-oh-four/four-oh-four.component";
import { Navigate } from "react-router-dom";
import Home from "./components/home/home.component";

export const appRoutes = [
    {
        path: '/dashboard',
        component: <Dashboard />,
        exact: true,
        key: 'dashboard'
    },
    {
        path: '/books',
        component: <Books />,
        exact: true,
        key: 'books'
    },
    {
        path: '/create-book',
        component: <CreateBook />,
        exact: true,
        key: 'create-book'
    },
    {
        path: '/my-books',
        component: <MyBooks />,
        exact: true,
        key: 'my-books'
    },
    {
        path: '*',
        component: <FourOhFour />,
        exact: false,
        key: 'four-oh-four'
    }
];

export const authRoutes = [
    {
        path: '/',
        component: <Home />,
        exact: false,
        key: 'home'
    },
    {
        path: '/login',
        component: <Login />,
        exact: true,
        key: 'login'
    },
    {
        path: '/signup',
        component: <Signup />,
        exact: true,
        key: 'signup'
    },
    {
        path: '*',
        component: <Navigate to="/" />,
        exact: false,
        key: 'unknown-route'
    }
];