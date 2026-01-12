import NavBar from '../components/NavBar';
import RollingProjectsList from '../components/RollingProjectsList';
import { projects } from '../data/projects';

const ProjectsPage = () => {
  // Sort pinned projects first
  const orderedProjects = [
    ...projects.filter((p) => p.pinned),
    ...projects.filter((p) => !p.pinned),
  ];

  return (
    <>
      <div className="name">
        <h1>boagDev</h1>
        <h2>engineering intelligence</h2>
      </div>

      <NavBar />

      <RollingProjectsList projects={orderedProjects} />
    </>
  );
};

export default ProjectsPage;
