// Routes appId → app component. Every app is React.lazy()-loaded so its
// chunk only downloads when its window first opens (brief §14 rule 3).
import { lazy } from 'react';

const FileExplorer = lazy(() => import('../apps/FileExplorer'));
const ProjectViewer = lazy(() => import('../apps/FileExplorer/ProjectViewer'));
const TerminalApp = lazy(() => import('../apps/Terminal'));
const About = lazy(() => import('../apps/About'));
const Resume = lazy(() => import('../apps/Resume'));
const Contact = lazy(() => import('../apps/Contact'));
const Portfolio = lazy(() => import('../apps/Portfolio'));
const AIAssistant = lazy(() => import('../apps/AIAssistant'));
const DocReader = lazy(() => import('../apps/DocReader'));
const B3astEgg = lazy(() => import('../apps/EasterEggs/FakePwn'));
const HexDump = lazy(() => import('../apps/EasterEggs/HexDump'));
const Blog = lazy(() => import('../apps/Blog'));

const APPS = {
  fileExplorer: FileExplorer,
  terminal: TerminalApp,
  about: About,
  resume: Resume,
  contact: Contact,
  portfolio: Portfolio,
  aiAssistant: AIAssistant,
  docReader: DocReader,
  b3astEgg: B3astEgg,
  hexDump: HexDump,
  blogs: Blog,
};

export default function AppContent({ appId, props = {} }) {
  // projectViewer / docReader windows carry their target in the appId suffix
  // (e.g. projectViewer:<id>, docReader:<filename>) so each dedupes to its
  // own window instead of collapsing into one
  if (appId.startsWith('projectViewer')) {
    return <ProjectViewer projectId={props.projectId} />;
  }
  if (appId.startsWith('docReader')) {
    return <DocReader file={props.file} />;
  }

  const App = APPS[appId];
  if (!App) {
    return (
      <div style={{ padding: 20, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--t3)' }}>
        unknown app: {appId}
      </div>
    );
  }
  return <App {...props} />;
}
