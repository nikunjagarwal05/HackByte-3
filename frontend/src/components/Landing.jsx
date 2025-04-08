import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import image2 from "../assets/girl-ciry-pixel-removebg-preview.png"
import svgstar from "../assets/Experience.svg"
import svgsword from "../assets/sword.svg"

const Landing = () => {
    return (
        <div className="flex flex-col text-white">
            <div className="top-0 left-0 sticky w-full h-20 flex justify-between items-center bg-[#1a1a35] border-b border-[#3b4782]">
                <p className="text-4xl ml-10 font-medium">Wiki-Craft</p>

                <div className="flex items-center justify-center">
                    <ul className="flex gap-10 text-2xl">
                        <li><a href="#home" className="text-[#d1d1d1] hover:text-white cursor-pointer">Home</a></li>
                        <li><a href="#about" className="text-[#d1d1d1] hover:text-white cursor-pointer">About</a></li>
                        <li><a href="#function" className="text-[#d1d1d1] hover:text-white cursor-pointer">Functionality</a></li>
                        <li><a href="#contact" className="text-[#d1d1d1] hover:text-white cursor-pointer">Contact Us</a></li>
                    </ul>
                </div>

                <div>
                    <button className="h-12 w-32 text-2xl mr-10 bg-[#31314f] cursor-pointer shadow"><Link to={"/dashboard"}>Get Started</Link></button>
                </div>
            </div>

            <div className=" flex flex-col h-[100vh]">
                <section id="home" className="text-black h-[100vh] flex justify-start items-center">
                    <div className="flex flex-col gap-10">
                        <div className="text-8xl w-5xl font-bold ml-20">
                            <p>Your Wikipedia, Your Way: <span className="text-[#6f6f8c]">Effortless Editing,<br /> Enhanced Contribution.</span></p>
                            <p className="max-w-[800px] text-[#5959a4] text-3xl mt-10">
                            Unlock Your Potential to Enhance Wikipedia - Effortlessly! WikiQuest transforms learning into an engaging game. Earn points, complete challenges, and become a skilled contributor, making a real difference to the world's information.</p>
                        </div>
                        <button className="ml-20 mt-10 rounded-2xl text-2xl h-16 w-52 bg-[#232338] text-white hover:bg-[#6f6f8c]">Start Your Journey</button>
                    </div>

                    <div className="flex flex-col size-[600px]">
                        <div className="flex gap-42 ml-28">
                            <img className="size-20" src={svgstar} alt="svgstar" />
                            <img className="size-20" src={svgsword} alt="svgsword" />
                        </div>
                        <img src={image2} alt="img2" />
                    </div>

                </section>
            </div>


            <section id="about" className="h-[100vh] bg-[#2a2a2a] flex flex-col justify-start items-center">
                <div className="bg-black h-10 w-24 flex justify-center items-center rounded-xl text-2xl mt-10">About</div>

            </section>

            <section id="function">
            </section>

            <section id="contact">
            </section>

            <Footer />
        </div>
    );
};

export default Landing;
