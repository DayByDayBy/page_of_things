import gitSVG from "../assets/git.svg";
import liSVG from "../assets/linkedIn.svg";
import { NavLink, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const isProjects = location.pathname === "/projects";
  return (
    <>
      <nav className="svglink" aria-label="primary navigation">
        <div className="svglink-links">
          {isProjects ? (
            <NavLink to="/" end>
              home
            </NavLink>
          ) : (
            <NavLink to="/projects">projects</NavLink>
          )}
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
