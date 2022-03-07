import {
  StarIcon,
  WatchIcon,
  BugIcon,
  GithubIcon,
  projectIcons
} from '../../components/Icons';
import useSWR from 'swr';
import { projects } from '../../utils/projectsData';

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function Project({ project }) {
  const Icon = projectIcons[project.id];

  const { data, error } = useSWR('/api/message', fetcher);
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className="project">
      <aside>
        <h3>{data.text}</h3>
        <ul>
          {projects.map((project) => {
            return (
              <li key={project.id}>
                <a href={`/project/${project.slug}`}>{project.name}</a>
              </li>
            );
          })}

          <li>
            <a href="/">Home</a>
          </li>
        </ul>
      </aside>
      <main>
        <div className="card-big">
          <Icon w={249} h={278} />
          <div className="stats">
            <div className="stats-details">
              <div>
                <StarIcon w={18} h={18} />
                <p>{project.stargazers_count}</p>
              </div>
              <p>stars</p>
            </div>
            <div className="stats-details">
              <div>
                <WatchIcon w={18} h={18} />
                <p>{project.subscribers_count}</p>
              </div>
              <p>watchers</p>
            </div>
            <div className="stats-details">
              <div>
                <BugIcon w={18} h={18} />
                <p>{project.open_issues}</p>
              </div>
              <p>issues</p>
            </div>
          </div>
          <p className="description">{project.description}</p>
          <div className="cta">
            <a
              className="button-github"
              href={project.html_url}
              target="_blank"
            >
              <GithubIcon w={24} h={24} />
              Learn more...
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export async function getStaticPaths() {

  const paths = projects.map((project) => ({
    params: { path: project.slug },
  }))

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const project = projects.find(proj => proj.slug === params.path);
  const ghPath = project.path;
  const res = await fetch(`https://api.github.com/repos/${ghPath}`);
  const data = await res.json();
  project.open_issues = data.open_issues || 0;
  project.subscribers_count = data.subscribers_count || 0;
  project.stargazers_count = data.stargazers_count || 0;
  return { props: { project } };
}

export default Project;
