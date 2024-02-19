import GlobalGameJam from "./projects/GlobalGameJam";
import TechMeetUp from "./projects/TechMeet";


const RightBox = () => {
    return (
        <>
            <div className="right-box">
                <h2> some stuff i do</h2>
                <div className="item-box">
                    <GlobalGameJam />
                    </div>
                    <div className="item-box">
                    <TechMeetUp/>
                    </div>
    </div>

        </>
    )
};

export default RightBox;