import { useState } from "react";
import { Link } from "react-router-dom";
import userAvatar from "../assets/red-man-pixel.jpeg"; 

export default function Sidebar() {
    const [showSettings, setShowSettings] = useState(false);

    const currentLevel = 0;
    const currentXP = 100;
    const xpForNextLevel = 100;
    const gold = 250;

    const progress = (currentXP / xpForNextLevel) * 100;

    return (
        <nav className="flex flex-col sticky top-0 w-80 h-[100vh] text-white border-r border-gray-700 shadow-lg py-6 px-4">
            {/* App Name */}
            <div className="text-3xl font-bold flex justify-center items-center gap-2 mb-10 tracking-wide">
                <Link to={"/"}>WikiCraft</Link>
                <span className="text-yellow-400 text-2xl">✨</span>
            </div>

            {/* Avatar */}
            <div className="flex justify-center mb-10">
                <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg">
                    <img
                        src={userAvatar}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Level Display */}
            <div className="px-2 mb-6">
                <p className="text-xl font-semibold">Level: <span className="text-[#d3b65e]">{currentLevel}</span></p>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full text-sm px-2 mb-6 space-y-2">
                <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#38bdf8] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                    <span>EXP</span>
                    <span>{currentXP} / {xpForNextLevel}</span>
                </div>
            </div>

            {/* Gold Count */}
            <div className="px-2 mb-10">
                <p className="text-xl font-semibold">Gold: <span className="text-[#7dd3fc]">{gold}</span></p>
            </div>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* Settings Toggle Button */}
            <div className="relative">
                <button
                    className="flex items-center gap-3 text-xl border-2 border-white px-6 py-3 rounded-full bg-[#102730] hover:bg-white hover:text-black transition-all duration-200 w-full"
                    onClick={() => setShowSettings(!showSettings)}
                >
                    <i className="fa-solid fa-gear"></i>
                    <span>Settings</span>
                </button>

                {/* Slide-out Settings Panel */}
                {showSettings && (
                    <div className="mt-4 p-4 rounded-lg bg-[#0f1a20] border border-gray-600 shadow-md transition-all duration-500 ease-in-out animate-slide-in">
                        <h2 className="text-lg font-bold mb-3">Settings</h2>
                        <ul className="space-y-2 text-sm">
                            <li><label><input type="checkbox" className="mr-2" /> Dark Mode</label></li>
                            <li><label><input type="checkbox" className="mr-2" /> Sound Effects</label></li>
                            <li><label><input type="checkbox" className="mr-2" /> Show Tips</label></li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
}