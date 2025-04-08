import React from "react";
import DashTitle from "./DashTitle";

const DashLevels = () => {
    
    return (
        <div>
            <DashTitle
                section="SECTION 1"
                title="Wikipedia's Five Pillars"
                cards={[
                    { unit: "UNIT 1", subtitle: "Intro to Wikipedia" },
                    { unit: "UNIT 2", subtitle: "Neutrality + Civility" },
                    { unit: "UNIT 3", subtitle: "What Wikipedia is / is not" },
                    { unit: "UNIT 4", subtitle: "Collaboration & rules" }
                ]}
            />

            <DashTitle 
                section="SECTION 2"
                title="What Wikipedia is NOT"
                cards={[
                    { unit: "UNIT 1", subtitle: "Wikipedia ≠ Soapbox" },
                    { unit: "UNIT 2", subtitle: "NOT a blog or social media" },
                    { unit: "UNIT 3", subtitle: "NOT a publisher of original thought" }
                ]}
            />
            <DashTitle 
                section="SECTION 3"
                title="Verifiability"
                cards={[
                    { unit: "UNIT 1", subtitle: "Reliable sources" },
                    { unit: "UNIT 2", subtitle: "Citing properly" },
                    { unit: "UNIT 3", subtitle: "No speculation / personal experience" }
                ]}
            />
            <DashTitle 
                section="SECTION 4"
                title="No Original Research"
                cards={[
                    { unit: "UNIT 1", subtitle: "Primary vs Secondary sources" },
                    { unit: "UNIT 2", subtitle: "Avoid synthesis" }
                ]}
            />
            <DashTitle 
                section="SECTION 5"
                title="Neutral Point of View"
                cards={[
                    { unit: "UNIT 1", subtitle: "What is NPOV" },
                    { unit: "UNIT 2", subtitle: "Biases to avoid" },
                    { unit: "UNIT 3", subtitle: "Representing all sides fairly" }
                ]}
            />
            <DashTitle 
                section="SECTION 6"
                title="Copyrights"
                cards={[
                    { unit: "UNIT 1", subtitle: "Public domain vs copyrighted" },
                    { unit: "UNIT 2", subtitle: "Attribution and licensing" }
                ]}
            />
            <DashTitle 
                section="SECTION 7"
                title="Getting Started"
                cards={[
                    { unit: "UNIT 1", subtitle: "Sandbox" },
                    { unit: "UNIT 2", subtitle: "Using Talk Pages" },
                    { unit: "UNIT 3", subtitle: "First real edits" }
                ]}
            />
        </div>
    );
};
export default DashLevels;