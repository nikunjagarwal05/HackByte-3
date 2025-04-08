import React from "react";

const Footer = () => {

    return(
        <div className = "bg-[#4E4E5A] relative h-[700px]" style={{clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"}}>
            <div className="relative h-[calc(100vh+700px)] -top-[100vh]">
                <div className="sticky top-[calc(100vh-700px)] h-[700px] ">
                    <Content />
                </div>
            </div>
        </div>
    );
}; 


const Content = () => {

    return(
        <div className= "py-8 px-12 h-full flex flex-col justify-between">
            <Section1 />
            <Section2 />
        </div>
    )
}

const Section1 = () => {
    return(
        <div className="text-white">
            <Nav />
        </div>
    )
}

const Section2 = () => {
    return(
        <div className="flex justify-between items-end text-white">
            <p>@copyright</p>
        </div>
    )
}

const Nav = () => {
    return(
        <div className="flex shrink-0 gap-20 text-[#ffffff80]">
            <div className="flex flex-col gap-2">
            </div>

            <div className="flex flex-col gap-2">
                <h3 className="mb-2 uppercase">Connect</h3>
            </div>
        </div>
    )
}

export default Footer;