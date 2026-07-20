// Portfolio — Recruiter Landing Mode
// Lenis smooth scroll scoped to this container (no global Lenis so other
// windows are unaffected). Sections fade in via Framer Motion whileInView.
// No parallax — breaks on mobile. No skill bars — those are cringe.
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import DownloadRounded from '@mui/icons-material/DownloadRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailRounded from '@mui/icons-material/EmailRounded';
import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import Lenis from 'lenis';
import { portfolioData } from '../../../data/portfolioData';
import { useWindowStore } from '../../../store/windowStore';
import { getApp } from '../../../data/appRegistry';

// --- Animation presets -------------------------------------------------------

const REVEAL = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
};

const STAGGER_PARENT = {
  initial: {},
  whileInView: {},
  viewport: { once: true, margin: '-48px' },
  transition: { staggerChildren: 0.09 },
};

const STAGGER_CHILD = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};

// --- Experience timeline color by type ---------------------------------------
const EXP_COLORS = {
  internship: 'warning',   // amber
  mentorship: 'secondary', // violet
  technical:  'primary',   // cyan/lime
};

// --- Filter categories -------------------------------------------------------
const FILTER_CATEGORIES = ['All', 'Systems', 'Security', 'Web', 'Android'];

const PROJECT_TAGS = {
  'network-media-controller':  'Systems',
  'pesu-content-automation':   'Web',
  'semwork':                   'Web',
  'vegavath-site':             'Web',
  'tcp-auction-engine':        'Systems',
  'linux-container-runtime':   'Systems',
  'pes-vcs':                   'Systems',
  'mehnat':                    'Android',
};

// Featured projects: the three most distinctive/impressive
const FEATURED_IDS = ['tcp-auction-engine', 'linux-container-runtime', 'vegavath-site'];

// --- Small sub-components ----------------------------------------------------

function SectionLabel({ children }) {
  return (
    <Typography
      variant="overline"
      sx={{
        display: 'block', mb: 0.5,
        color: 'primary.main',
        letterSpacing: '0.12em',
        fontWeight: 700,
        fontSize: '0.7rem',
      }}
    >
      {children}
    </Typography>
  );
}

function ProjectCard({ project, featured = false }) {
  const svgPath = `/assets/projects/${project.id}.svg`;

  return (
    <Card
      component={motion.div}
      {...STAGGER_CHILD}
      variant="outlined"
      sx={{
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'box-shadow 220ms, transform 220ms',
        '&:hover': { boxShadow: 6, transform: 'translateY(-3px)' },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Project visual */}
      <Box
        component="img"
        src={svgPath}
        alt={`${project.name} preview`}
        loading="lazy"
        sx={{
          width: '100%',
          aspectRatio: '600 / 340',
          objectFit: 'cover',
          bgcolor: '#0d0d1a',
          display: 'block',
          flexShrink: 0,
        }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant={featured ? 'h6' : 'subtitle1'} fontWeight={700}>
          {project.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
          {project.hook}
        </Typography>

        <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
          {project.tech.slice(0, featured ? 6 : 4).map(t => (
            <Chip key={t} label={t} size="small" color="primary" variant="outlined"
              sx={{ borderRadius: '8px', fontSize: '0.7rem', height: 22 }} />
          ))}
        </Stack>

        {project.github && (
          <Button
            size="small"
            startIcon={<GitHubIcon />}
            endIcon={<OpenInNewRounded sx={{ fontSize: 13 }} />}
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ alignSelf: 'flex-start', mt: 0.5, px: 1.5, borderRadius: '10px' }}
            variant="outlined"
          >
            GitHub
          </Button>
        )}
        {!project.github && project.demo && (
          <Button
            size="small"
            endIcon={<OpenInNewRounded sx={{ fontSize: 13 }} />}
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ alignSelf: 'flex-start', mt: 0.5, px: 1.5, borderRadius: '10px' }}
            variant="outlined"
          >
            {project.demo.replace('https://', '')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// --- Main component ----------------------------------------------------------

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const containerRef = useRef(null);
  const { personal, projects, experience, skillGroups } = portfolioData;
  const open = useWindowStore(s => s.open);

  // Lenis scoped to this container so other windows scroll normally
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const lenis = new Lenis({ wrapper: el, content: el.firstElementChild || el, lerp: 0.1, smooth: true });
    let raf;
    function loop(t) { lenis.raf(t); raf = requestAnimationFrame(loop); }
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  const featured = projects.filter(p => FEATURED_IDS.includes(p.id));
  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => PROJECT_TAGS[p.id] === filter);

  return (
    <Box
      ref={containerRef}
      sx={{ height: '100%', overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain' }}
    >
      <Box sx={{ maxWidth: 900, mx: 'auto', px: { xs: 2.5, sm: 4 }, pb: 10 }}>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <Box
          component={motion.div}
          {...REVEAL}
          sx={{ pt: { xs: 6, sm: 8 }, pb: 6 }}
        >
          {/* Subtle "terminal handle" above the name */}
          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: 'primary.main',
              mb: 1.5,
              letterSpacing: '0.05em',
            }}
          >
            ~/b3astos $
          </Typography>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.4rem', sm: '3.2rem' },
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              mb: 0.75,
            }}
          >
            Abhigyan Dutta
          </Typography>

          <Typography
            sx={{
              fontFamily: 'var(--font-mono)',
              fontSize: { xs: '0.82rem', sm: '0.95rem' },
              color: 'text.secondary',
              mb: 1,
              letterSpacing: '0.02em',
            }}
          >
            systems engineer · security researcher · ctf competitor
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 580, mb: 3, lineHeight: 1.7, fontSize: { xs: '0.95rem', sm: '1rem' } }}
          >
            I build things close to the metal. Kernel space, C, and broken binaries.
          </Typography>

          <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<DownloadRounded />}
              onClick={() => {
                const a = getApp('resume');
                open('resume', { title: a.label, defaultSize: a.defaultSize });
              }}
              sx={{ borderRadius: '12px', px: 2.5, fontWeight: 600 }}
            >
              Resume
            </Button>
            <Button
              variant="outlined"
              startIcon={<GitHubIcon />}
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderRadius: '12px', px: 2.5 }}
            >
              GitHub
            </Button>
            <Button
              variant="outlined"
              startIcon={<LinkedInIcon />}
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderRadius: '12px', px: 2.5 }}
            >
              LinkedIn
            </Button>
            <Button
              variant="text"
              startIcon={<EmailRounded />}
              href={`mailto:${personal.email}`}
              sx={{ borderRadius: '12px', px: 1.5 }}
            >
              Contact
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ mb: 6, opacity: 0.4 }} />

        {/* ── FEATURED PROJECTS ────────────────────────────────────────── */}
        <Box component={motion.div} {...REVEAL} sx={{ mb: 7 }}>
          <SectionLabel>Featured Projects</SectionLabel>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Things I built that I'm proud of
          </Typography>
          <Box
            component={motion.div}
            {...STAGGER_PARENT}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
              gap: 2.5,
            }}
          >
            {featured.map(p => <ProjectCard key={p.id} project={p} featured />)}
          </Box>
        </Box>

        {/* ── ALL PROJECTS ─────────────────────────────────────────────── */}
        <Box component={motion.div} {...REVEAL} sx={{ mb: 7 }}>
          <SectionLabel>All Projects</SectionLabel>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2.5 }}>
            Everything I've shipped
          </Typography>

          {/* Filter tabs */}
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(_, v) => v && setFilter(v)}
            size="small"
            sx={{ mb: 3, flexWrap: 'wrap', gap: 0.5 }}
          >
            {FILTER_CATEGORIES.map(cat => (
              <ToggleButton
                key={cat}
                value={cat}
                sx={{
                  borderRadius: '10px !important',
                  px: 2,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  border: 1,
                  borderColor: 'divider',
                  '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                }}
              >
                {cat}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Box
            component={motion.div}
            key={filter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            {filteredProjects.map(p => <ProjectCard key={p.id} project={p} />)}
          </Box>
        </Box>

        {/* ── EXPERIENCE TIMELINE ──────────────────────────────────────── */}
        <Box component={motion.div} {...REVEAL} sx={{ mb: 7 }}>
          <SectionLabel>Experience</SectionLabel>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Where I've contributed
          </Typography>

          <Stack spacing={0}>
            {experience.map((e, idx) => {
              const color = EXP_COLORS[e.type] || 'primary';
              return (
                <Box
                  key={e.org}
                  component={motion.div}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-32px' }}
                  transition={{ duration: 0.45, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  sx={{ display: 'flex', gap: 2.5 }}
                >
                  {/* Timeline rail */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
                    <Box sx={{
                      width: 12, height: 12, borderRadius: '50%', flexShrink: 0, mt: 0.6,
                      bgcolor: `${color}.main`,
                      boxShadow: (t) => `0 0 0 3px ${t.vars?.palette[color]?.main ?? '#888'}40`,
                    }} />
                    {idx < experience.length - 1 && (
                      <Box sx={{ flex: 1, width: 2, bgcolor: 'divider', minHeight: 32, mt: 0.5 }} />
                    )}
                  </Box>

                  {/* Content */}
                  <Box sx={{ pb: idx < experience.length - 1 ? 4 : 0 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { sm: 'baseline' }, gap: 0.25 }}>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {e.role}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                        {e.period}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color={`${color}.main`} fontWeight={600} sx={{ mb: 0.5 }}>
                      {e.org}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                      {e.notes}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* ── SKILLS ───────────────────────────────────────────────────── */}
        <Box component={motion.div} {...REVEAL} sx={{ mb: 7 }}>
          <SectionLabel>Skills</SectionLabel>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            What I work with
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            {Object.entries(skillGroups).map(([group, items]) => (
              <Card
                key={group}
                component={motion.div}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                variant="outlined"
                sx={{ borderRadius: '16px', p: 0 }}
              >
                <CardContent>
                  <Typography
                    variant="overline"
                    sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.1em', fontSize: '0.68rem', display: 'block', mb: 1.5 }}
                  >
                    {group}
                  </Typography>
                  <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 0.75 }}>
                    {items.map(skill => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{
                          borderRadius: '8px',
                          bgcolor: 'action.hover',
                          fontSize: '0.72rem',
                          height: 24,
                          fontFamily: skill.includes('·') ? 'var(--font-mono)' : undefined,
                        }}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* ── CONTACT ──────────────────────────────────────────────────── */}
        <Box component={motion.div} {...REVEAL} sx={{ mb: 4 }}>
          <SectionLabel>Contact</SectionLabel>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>
            Let's work together
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 480 }}>
            Open to summer 2027 internships — systems, security, or full-stack.
          </Typography>

          <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<EmailRounded />}
              href={`mailto:${personal.email}`}
              sx={{ borderRadius: '12px', px: 2.5 }}
            >
              {personal.email}
            </Button>
            <Button
              variant="outlined"
              startIcon={<GitHubIcon />}
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderRadius: '12px', px: 2 }}
            >
              GitHub
            </Button>
            <Button
              variant="outlined"
              startIcon={<LinkedInIcon />}
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ borderRadius: '12px', px: 2 }}
            >
              LinkedIn
            </Button>
            <Button
              variant="text"
              startIcon={<DownloadRounded />}
              href="/resume.pdf"
              download="Abhigyan_Resume.pdf"
              sx={{ borderRadius: '12px', px: 1.5 }}
            >
              Resume PDF
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ opacity: 0.3, mb: 3 }} />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontFamily: 'var(--font-mono)', display: 'block', pb: 2 }}
        >
          {personal.email} · github.com/UltraBot05 · linkedin.com/in/adutta05
        </Typography>

      </Box>
    </Box>
  );
}
