import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SendRounded from '@mui/icons-material/SendRounded';
import BoltRounded from '@mui/icons-material/BoltRounded';
import { queryAIOrchestrator } from '../../../utils/aiOrchestrator';
import { handleCommand } from '../../../utils/commandHandler';

const SUGGESTIONS = [
  'What did you do at OpenWISP?',
  'Tell me about the media controller',
  'What languages do you know?',
  'Are you available for internships?',
];

// Strip terminal HTML/ASCII framing so command output reads cleanly in a chat
// bubble.
function plainify(text) {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/[│┌┐└┘─├┤]/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

let sessionMessages = [];

export default function AIAssistant() {
  const [messages, setMessages] = useState(sessionMessages);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { sessionMessages = messages; }, [messages]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    const clean = text.trim();
    if (!clean || busy) return;
    setInput('');
    setBusy(true);
    setMessages(prev => [...prev, { role: 'user', text: clean }]);

    const result = await queryAIOrchestrator(clean);
    let reply = result.response || '';
    // If the orchestrator (or local fallback) chose a command, run it and
    // append its output so the chat actually answers.
    if (result.command) {
      const out = handleCommand(result.command);
      if (out?.isCommand && out.output) {
        reply = (reply ? reply + '\n\n' : '') + plainify(out.output);
      }
    }
    if (!reply) reply = "I'm not sure about that one. Try asking about my projects, skills, or how to reach me.";
    setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    setBusy(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={1} sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', alignItems: 'baseline' }}>
        <Typography variant="subtitle1" fontWeight={600}>B3ast AI</Typography>
        <Typography variant="caption" color="text.secondary">powered by Gemini</Typography>
      </Stack>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {messages.length === 0 && (
          <Stack spacing={1} useFlexGap sx={{ m: 'auto', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <Typography variant="caption" color="text.secondary">try asking:</Typography>
            {SUGGESTIONS.map(s => <Chip key={s} label={s} onClick={() => send(s)} variant="outlined" color="primary" clickable />)}
          </Stack>
        )}

        {messages.map((m, i) => (
          <Stack key={i} direction="row" spacing={1} sx={{ maxWidth: '86%', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            {m.role === 'assistant' && <Avatar sx={{ width: 26, height: 26, bgcolor: 'primary.main' }}><BoltRounded sx={{ fontSize: 16 }} /></Avatar>}
            <Paper
              variant={m.role === 'user' ? 'elevation' : 'outlined'}
              elevation={m.role === 'user' ? 0 : undefined}
              sx={{
                px: 1.5, py: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                bgcolor: m.role === 'user' ? 'primary.main' : 'surface.high',
                color: m.role === 'user' ? 'primary.contrastText' : 'text.primary',
                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '4px 16px 16px 16px',
                fontFamily: m.role === 'assistant' ? 'var(--font-mono)' : undefined,
                fontSize: 13.5,
              }}
            >
              {m.text}
            </Paper>
          </Stack>
        ))}
        <div ref={endRef} />
      </Box>

      <Stack direction="row" spacing={1} sx={{ p: 1.5, borderTop: 1, borderColor: 'divider', alignItems: 'flex-end' }}>
        <TextField
          fullWidth multiline maxRows={4} size="small" value={input}
          onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown}
          placeholder="Ask about projects, skills, experience..."
          slotProps={{ input: { sx: { borderRadius: '20px', fontFamily: 'var(--font-mono)', fontSize: 13.5 } } }}
        />
        <IconButton color="primary" onClick={() => send(input)} disabled={busy || !input.trim()} aria-label="Send">
          <SendRounded />
        </IconButton>
      </Stack>
    </Box>
  );
}
