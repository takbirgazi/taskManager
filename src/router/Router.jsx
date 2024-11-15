import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../components/Home";
import ErrorPage from '../pages/ErrorPage';

const router = createBrowserRouter([
    {
        path: "/",
        errorElement: <ErrorPage />,
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />
            },
        ],
    },
]);


export default router;