import React, {useState, useEffect} from "react";
import morningImage from "../assets/Morning.jpg";
import afternoonImage from "../assets/Afternoon.jpg";
import nightImage from "../assets/Night.jpg";
import eveningImage from "../assets/Evening.jpg";


const Dashboard = () => {
    const [greeting, setGreeting] = useState("Good Morning");
    

    useEffect(() => {
        const updateGreeting = () => {
            const currentHour = new Date().getHours();
    
            if(currentHour >= 5 && currentHour < 12) {
                setGreeting("Morning");
            } else if(currentHour >= 12 && currentHour < 17){
                setGreeting("Afternoon");
            } else if(currentHour >= 17 && currentHour < 21){
                setGreeting("Evening");
            } else {
                setGreeting("Night");
            }
        };
    
        updateGreeting();
        const interval = setInterval(updateGreeting, 1000*60);
        return () => clearInterval(interval);
    
    }, []);
    
    const getBackgroundImage = () => {
        switch(greeting) {
            case "Morning":
                return morningImage;
            case "Afternoon":
                return afternoonImage;
            case "Evening":
                return eveningImage;
            case "Night":
                return nightImage;
            default:
                return morningImage;
        }
    };


    return(
        <div className="flex h-[100vh] flex-col text-white bg-black">
            <section className="flex gap-10">
                <nav className="flex flex-col justify-start top-0 left-0 w-96 h-[90vh] bg-white text-black m-10 rounded-3xl">
                    
                    <div className="flex flex-col items-center justify-center gap-10">
                        <p className="text-4xl font-bold mt-10">Wiki Media</p>
                        <div className="rounded-full h-52 w-52 bg-[#787878]"></div>
                    </div>

                    <div className="flex flex-col justify-center items-start ml-8 text-xl gap-8">
                        <p className="mt-4">Level: 0</p>
                        <p>Experience:</p>
                        <div className="w-80 ml-4 flex flex-col">
                            <div className="bg-[#271b3d] dark:bg-[#282828] h-5 rounded-full">
                                <div className="bg-[#763939] delay-50 ease-out transition-all h-5 rounded-full" ></div>
                            </div>
                            <p>100/100</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 m-8 text-xl">
                        <p>Health:</p>
                        <p>Streak: </p>
                    </div>

                    <div className="flex flex-col gap-5 m-8 text-xl">
                        <p className="bottom-20 absolute">Settings</p>
                    </div>
                </nav>
                
                <div className="flex flex-col">
                    <div className="flex text-xl justify-center items-center gap-10 pt-5 pl-5 right-0 absolute">
                        <p>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
                        <p>{new Date().toLocaleDateString()}</p>
                        <p>{new Date().toLocaleTimeString()}</p>
                    </div>
                    
                    <div className="flex flex-col justify-center items-center mt-20 w-6xl h-48 rounded-4xl bg-[#bebebe]">
                        <div className="flex flex-col justify-center items-center h-48 w-6xl bg-[#D9D9D9] dark:bg-[#3F3F3F] rounded-[17px] bg-cover bg-center" style={{backgroundImage: `url(${getBackgroundImage()})`,}}>
                            <p className="text-6xl text-white font-bold">Good {greeting},</p>
                            <p className="text-xl px-3 text-white">user</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;