import React from "react";

const Title = ({title}: {title: string}) => {
    return <p className="text-lg text-imdb-yellow uppercase my-4 font-bold tracking-wider">{title}</p>;
};

export default Title;
