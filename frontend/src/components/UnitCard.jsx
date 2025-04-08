import { Link } from "react-router-dom";

const UnitCard = ({ unit, subtitle }) => {
  const sectionSlug = unit.toLowerCase().replace(/\s/g, "-");

  return (
    <Link to={`/dashboard/section/${sectionSlug}`} className="no-underline">
      <div className="bg-green-200 hover:bg-green-300 p-4 rounded-xl shadow-md mb-3 cursor-pointer transition">
        <strong>{unit}:</strong> {subtitle}
      </div>
    </Link>
  );
};
