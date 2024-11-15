import Task from "./Task";


const Home = () => {
    return (
        <div className="bg-gray-900 min-h-screen">
            <h2 className="text-center font-bold text-4xl pt-11 text-gray-100">Task Manager</h2>
            <Task />
        </div>
    );
};

export default Home;