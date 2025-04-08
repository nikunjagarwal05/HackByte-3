import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import morningImage from "../assets/morning.jpg";
import afternoonImage from "../assets/afternoon.jpg";
import nightImage from "../assets/night.jpg";
import eveningImage from "../assets/evening.jpg";
import Sidebar from "./SideBar";

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
        <div className="flex h-[100vh] flex-col text-white" >
            <section className="flex gap-10 bg-[url('/assets/background.svg')] bg-cover bg-center" >
                <Sidebar />
                
                <div className="flex flex-col justify-center items-center">
                    <div className="flex flex-col ml-10">
                        <div className="flex text-xl font-bold justify-center items-center gap-10 m-8 right-0 absolute">
                            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                            <p>{new Date().toLocaleDateString()}</p>
                            <p>{new Date().toLocaleTimeString()}</p>
                        </div>
                        
                        <div className="flex mt-24 w-6xl h-48 rounded-4xl bg-[#bebebe]">
                            <div className="flex flex-col justify-center items-center h-48 w-6xl rounded-[30px] bg-cover font-bold" style={{backgroundImage: `url(${getBackgroundImage()})`}}>
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