import React from "react";
import { FiLoader } from "react-icons/fi";

const Loader = () => {
    return (
        <div>
            <div className="text-white text-center py-10 h-screen flex flex-col justify-center items-center ">
                <FiLoader className="animate-spin mx-auto mb-4 text-imdb-yellow" size={48} />
                Loading...
            </div>
        </div>
    );
};

export default Loader;
