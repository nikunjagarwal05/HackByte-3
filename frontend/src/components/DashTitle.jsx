import { Link } from "react-router-dom";
import DashCards from "./DashCards";

const DashTitle = ({ section = "SECTION 1", title = "Use basic phrases", cards = [] }) => {
  const rows = [];
  for (let i = 0; i < cards.length; i += 2) {
    rows.push(cards.slice(i, i + 2));
  }

  const sectionPath = section.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-10 justify-center items-center">
      <div className="w-xl bg-[#644c71] rounded-2xl p-7 mt-10 flex flex-col items-center">
        <p className="text-md font-semibold text-white">{section}</p>
        <h1 className="text-3xl font-bold text-white text-center">{title}</h1>
      </div>

      <div className="flex flex-col gap-5">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-4">
            {row.map((card, index) => (
              <DashCards
                key={index}
                unit={card.unit}
                subtitle={card.subtitle}
                section={sectionPath} // ensures the section gets passed properly
              />
            ))}
          </div>
        ))}

        {/* Yellow Exam Card */}
        <div className="flex justify-center items-center border-b-1 pb-14">
        <Link to={`/dashboard/${sectionPath}/exam`}>
            <div className="flex flex-col gap-2 justify-center items-center bg-[#c49041] rounded-2xl p-4 w-md cursor-pointer hover:scale-105 transition">
                <p className="text-white text-lg font-bold">EXAM</p>
            </div>
        </Link>

        </div>
      </div>
    </div>
  );
};

export default DashTitle;
