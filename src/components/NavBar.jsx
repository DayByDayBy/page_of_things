import gitSVG from "../assets/git.svg";
import liSVG from "../assets/linkedIn.svg";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <nav className="svglink" aria-label="primary navigation">
        <div className="svglink-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            home
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            projects
          </NavLink>
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
      </nav>
    </>
  );
};

export default NavBar;
