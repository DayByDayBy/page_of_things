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
                <strong>
                  {(() => {
                    const links = project.links || [];
                    const href =
                      links.find((l) => l.label === 'repo' || l.kind === 'github')?.href ||
                      links[0]?.href;

                    return href ? (
                      <a href={href} target="_blank" rel="noreferrer noopener">
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    );
                  })()}
                </strong>
                {project.tags?.length ? (
                  <span className="projects-tags">[{project.tags.join(' · ')}]</span>
                ) : null}
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
