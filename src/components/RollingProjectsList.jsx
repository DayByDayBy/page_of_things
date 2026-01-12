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
import { motion, AnimatePresence } from 'framer-motion';

const VISIBLE_COUNT = 3;
const INITIAL_DELAY_MS = 2500;
const ROTATION_INTERVAL_MS = 8000;
const ANIMATION_DURATION_S = 0.45;

const RollingProjectsList = ({ projects }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Initial delay before rotation begins
  useEffect(() => {
    if (projects.length <= VISIBLE_COUNT) return;
    const timer = setTimeout(() => setHasStarted(true), INITIAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [projects.length]);

  // Rotation interval
  useEffect(() => {
    if (!hasStarted || projects.length <= VISIBLE_COUNT) return;
    const timer = setInterval(() => {
      setStartIndex((i) => (i + 1) % projects.length);
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [hasStarted, projects.length]);

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
      <motion.ul className="projects-list" layout>
        <AnimatePresence initial={false}>
          {visibleProjects.map((project) => {
            const href = getProjectHref(project);
            return (
              <motion.li
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: ANIMATION_DURATION_S, ease: 'easeInOut' }}
              >
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
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
};

export default RollingProjectsList;
