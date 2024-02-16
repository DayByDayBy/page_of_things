import gitSVG from "../assets/git.svg";
import liSVG from "../assets/linkedIn.svg";

const Contact = () => {
  return (
    <>
      <div className="svglink">
        <a href="https://github.com/DayByDayBy">
          <img src={gitSVG} alt="github, DayByDayBy" />
        </a>
        <br></br>
        <br></br>
        <a href="https://www.linkedin.com/in/james-boag/">
          <img src={liSVG} alt="linkedIn, James Boag" />
        </a>
      </div>
    </>
  );
};

export default Contact;
