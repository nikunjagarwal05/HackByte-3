import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import morningImage from "../assets/morning.jpg";
import afternoonImage from "../assets/afternoon.jpg";
import nightImage from "../assets/night.jpg";
import eveningImage from "../assets/evening.jpg";
import userAvatar from "../assets/red-man-pixel.jpeg";

import DashLevels from "./DashLevels";

const Dashboard = () => {
    const [greeting, setGreeting] = useState("Good Morning");

    useEffect(() => {
        const updateGreeting = () => {
            const currentHour = new Date().getHours();
    
            if (currentHour >= 5 && currentHour < 12) {
                setGreeting("Good Morning");
            } else if (currentHour >= 12 && currentHour < 17) {
                setGreeting("Good Afternoon");
            } else if (currentHour >= 17 && currentHour < 21) {
                setGreeting("Good Evening");
            } else {
                setGreeting("Good Night");
            }
        };
    
        updateGreeting();
        const interval = setInterval(updateGreeting, 1000 * 60);
        return () => clearInterval(interval);
    }, []);
    
    const getBackgroundImage = () => {
        switch (greeting) {
            case "Good Morning":
                return morningImage;
            case "Good Afternoon":
                return afternoonImage;
            case "Good Evening":
                return eveningImage;
            case "Good Night":
                return nightImage;
            default:
                return morningImage;
        }
    };


    return(
        <div className="flex h-[100vh] flex-col text-white bg-[#132025]">
            <section className="flex gap-10 bg-[#132025]">
                <nav className="flex top-0 sticky flex-col justify-start w-80 h-[100vh] text-white border-r-1">
                    
                    <div className="flex flex-col items-center justify-center gap-10">
                        <p className="text-4xl font-bold mt-14 tracking-wider"><Link to={"/"}>WikiCraft ✨</Link></p>
                        <div className="size-48">
                            <img className="rounded-full mt-16" src={userAvatar} alt="User Avatar" />
                        </div>
                    </div>

                    <div className="flex flex-col mt-28 justify-center items-start ml-8 text-xl gap-8">
                        <p>Level: <strong>0</strong></p>
                        <div className="flex justify-center items-center">
                            <div className="w-60 ml-4 flex flex-col">
                                <div className="bg-[#271b3d] dark:bg-[#282828] h-5 rounded-full">
                                    <div className="bg-[#b43f3f] delay-50 ease-out transition-all h-5 rounded-full"></div>
                                </div>
                                <p className="text-sm ml-44 mt-1">100/100</p>
                            </div>
                        </div>

                        <p>Gold: <strong>0</strong></p>
                    </div>

                    <div className="flex bottom-16 gap-6 absolute items-center ml-8 text-xl">
                        <i className="fa-solid fa-gear" aria-label="Settings Icon"></i>
                        <p>Settings</p>
                    </div>
                </nav>
                
                <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col ml-10">
                        <div className="flex text-xl font-bold justify-center items-center gap-10 m-8 right-0 absolute">
                            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                            <p>{new Date().toLocaleDateString()}</p>
                            <p>{new Date().toLocaleTimeString()}</p>
                        </div>
                        
                        <div className="flex mt-24 w-6xl h-48 rounded-4xl bg-[#bebebe]">
                            <div className="flex flex-col justify-center items-center h-48 w-6xl rounded-[30px] bg-covers font-bold" style={{backgroundImage: `url(${getBackgroundImage()})`}}>
                                <p className="text-6xl text-white ">{greeting},</p>
                                <p className="text-2xl px-3 text-white">Nikunj</p>
                            </div>
                        </div>
                    </div>
                    
                    <DashLevels />
                </div>
            </section>
        </div>
    );
};

export default Dashboard;