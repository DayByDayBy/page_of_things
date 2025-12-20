import NavBar from '../components/NavBar';
import { projects } from '../data/projects';

const ProjectsPage = () => {
  return (
    <>
      <div className="name">
        <h1>boagDev</h1>
        <h2>engineering intelligence</h2>
      </div>

      <NavBar />

      <h3>projects</h3>
      <ul className="nav projects-list">
        {projects.map((project) => (
          <li key={project.id}>
            <strong>{project.title}</strong>
            {project.summary ? <div>{project.summary}</div> : null}
            {project.highlights?.length ? (
              <ul className="projects-highlights">
                {project.highlights.map((highlight, i) => (
                  <li key={i}>{highlight}</li>
                ))}
              </ul>
            ) : null}
            <div>
              {project.links.map((link, i) => (
                <span key={link.href}>
                  {i > 0 && ' · '}
                  <a href={link.href} target="_blank" rel="noreferrer noopener">
                    {link.label}
                  </a>
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ProjectsPage;
