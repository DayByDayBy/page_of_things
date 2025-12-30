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

      <ul className="nav projects-list">
        {projects.map((project) => (
          <li key={project.id}>
            <div className="projects-header">
              <div className="projects-header-left">
                <strong>{project.title}</strong>
                {project.tags?.length ? (
                  <span className="projects-tags">[{project.tags.join(' · ')}]</span>
                ) : null}
              </div>
              <div className="projects-header-links">
                {project.links.map((link, i) => (
                  <span key={link.href}>
                    {i > 0 && ' · '}
                    <a href={link.href} target="_blank" rel="noreferrer noopener">
                      {link.label}
                    </a>
                  </span>
                ))}
              </div>
            </div>
            {project.summary ? <div>{project.summary}</div> : null}
            {project.highlights?.length ? (
              <ul className="projects-highlights">
                {project.highlights.map((highlight, i) => (
                  <li key={i}>{highlight}</li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ProjectsPage;
