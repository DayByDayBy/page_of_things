import gitSVG from "../assets/git.svg";
import liSVG from "../assets/linkedIn.svg";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <div className="svglink">
        <div className="svglink-links">
          <Link to="/">home</Link>
          <Link to="/projects">projects</Link>
        </div>

        <div className="svglink-icons">
          <a
            href="https://github.com/DayByDayBy"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src={gitSVG} alt="github, DayByDayBy" />
          </a>

          <a
            href="https://www.linkedin.com/in/james-boag/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <img src={liSVG} alt="linkedIn, James Boag" />
          </a>
        </div>
      </div>
    </>
  );
};

export default NavBar;
