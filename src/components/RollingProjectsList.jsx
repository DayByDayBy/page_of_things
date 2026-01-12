/**
 * RollingProjectsList
 *
 * PURPOSE: Showcase projects with ambient, automatic vertical scrolling.
 * Motion should be noticeable only when watched, not during casual reading.
 *
 * NON-GOALS:
 * - Not a carousel, ticker, or filter
 * - No hover effects, controls, or pause-on-hover
 * - Not trying to show everything at once
 *
 * MOTION RULES:
 * - Direction: vertical, upward only
 * - Interval: 8 seconds between rotations
 * - Initial delay: 2.5 seconds (first state is static)
 * - Animation: 450ms ease-in-out
 * - If ≤3 projects: static, no rotation
 */

import { useState, useEffect } from 'react';

const VISIBLE_COUNT = 3;

const RollingProjectsList = ({ projects }) => {
  const [startIndex, setStartIndex] = useState(0);

  // Calculate visible window
  const visibleProjects =
    projects.length <= VISIBLE_COUNT
      ? projects
      : Array.from(
          { length: VISIBLE_COUNT },
          (_, i) => projects[(startIndex + i) % projects.length]
        );

  // Link selection: prefer repo/github, fallback to first
  const getProjectHref = (project) => {
    const links = project.links || [];
    return (
      links.find((l) => l.label === 'repo' || l.kind === 'github')?.href ||
      links[0]?.href
    );
  };

  return (
    <div className="projects-window">
      <ul className="projects-list">
        {visibleProjects.map((project) => {
          const href = getProjectHref(project);
          return (
            <li key={project.id}>
              <div className="projects-header">
                <div className="projects-header-left">
                  <strong>
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer noopener">
                        {project.title}
                      </a>
                    ) : (
                      project.title
                    )}
                  </strong>
                  {project.tags?.length > 0 && (
                    <span className="projects-tags">
                      [{project.tags.join(' · ')}]
                    </span>
                  )}
                </div>
              </div>
              {project.summary && (
                <div className="project-summary">{project.summary}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RollingProjectsList;
