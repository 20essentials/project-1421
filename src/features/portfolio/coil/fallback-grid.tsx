import { useEffect, useState } from 'react';
import type { ReelProject } from './engine';

const hasWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
};

export const FallbackGrid = ({ projects }: { projects: ReelProject[] }) => {
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!hasWebGL()) setUnavailable(true);
  }, []);

  if (!unavailable) return null;

  return (
    <div className='coil-fallback' role='group' aria-label='Progetti di matrimonio'>
      <ul className='coil-fallback-grid'>
        {projects.map((project) => (
          <li key={project.name}>
            <figure>
              <img
                src={project.image}
                alt={`${project.name} — ${project.category}`}
                loading='lazy'
              />
              <figcaption>{project.name}</figcaption>
              <p>{project.category}</p>
              <p>{project.description}</p>
              <a className='coil-vh' href={project.link}>
                Vai a {project.name}
              </a>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
};
