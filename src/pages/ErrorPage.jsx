import { NavLink } from "react-router-dom";

const ErrorPage = () => {
    return (
        <div className="bg-gray-900 min-h-screen flex justify-center items-center ">
            <div className="w-full h-full flex flex-col justify-center items-center gap-5">
                <h2 className="font-bold text-4xl text-gray-100">404 | Page Not Found</h2>
                <NavLink to="/" className="py-3 bg-gradient-to-r from-pink-500 to-blue-600 text-white px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105" >Go Back</NavLink>
            </div>
        </div>
    );
};

export default ErrorPage;