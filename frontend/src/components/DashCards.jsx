import React from "react";
import { useNavigate } from "react-router-dom";

const DashCards = ({ unit = "UNIT 1", subtitle = "", section = "section-1" }) => {
  const navigate = useNavigate();
  const formattedUnit = unit.toLowerCase().replace(/\s+/g, "-");
  const formattedSection = section.toLowerCase().replace(/\s+/g, "-");

  const handleClick = () => {
    navigate(`/${formattedSection}/${formattedUnit}`);
  };
  

  return (
    <div className="flex gap-4">
      <div
        className="flex flex-col gap-2 bg-[#538031] rounded-3xl p-4 w-md cursor-pointer hover:brightness-110 transition"
        onClick={handleClick}
      >
        <p className="text-white text-lg font-bold">{unit}</p>
        <p className="text-white">{subtitle}</p>
      </div>
    </div>
  );
};

export default DashCards;
