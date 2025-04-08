import React from "react";
import { useParams } from "react-router-dom";
import SectionData from "../data/SectionData";

const UnitPage = () => {
  const { sectionId, unitId } = useParams(); // e.g., section-1, unit-2
  const units = SectionData[sectionId];
  const unit = units?.find(u => u.unit === unitId);

  if (!unit) {
    return <div className="p-4 text-red-500">Unit not found.</div>;
  }

  return (
    <div className="flex justify-center items-center w-full h-[100vh] bg-[#132025] text-white">
      <div className="p-6 max-w-3xl mx-auto prose prose-lg">
        <h1 className="text-5xl font-bold mb-4">{unit.title}</h1>
        <div className="text-2xl tracking-wider" dangerouslySetInnerHTML={{ __html: unit.body }} />
      </div>
    </div>
  );
};

export default UnitPage;
