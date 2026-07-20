// Hex dump easter egg (brief §9.4). Opened by typing `xxd` in the terminal.
// Purely aesthetic - a fake binary hex dump with "B3AST" hidden in the
// printable-ASCII column on the right. Signals "this person knows what xxd is".
const HEX_ROWS = buildRows();

function buildRows() {
  // The printable column deliberately spells fragments of B3AST / VEGAVATH
  const ascii = [
    '.ELF....B3AST...',
    '..@.....pwn.rev.',
    'H..t$...web.ctf.',
    'XOR_KEY=0x42....',
    'VEGAVATH.tech...',
    'lead...kernel..0',
    'wns...the.core..',
    'systemd.hyprland',
  ];
  let offset = 0;
  return ascii.map(text => {
    // Derive hex bytes from the ascii text so the two columns are consistent
    const bytes = text.split('').map(ch => ch.charCodeAt(0).toString(16).padStart(2, '0'));
    const hexPairs = [];
    for (let i = 0; i < 16; i += 2) {
      hexPairs.push(`${bytes[i] || '00'}${bytes[i + 1] || '00'}`);
    }
    const row = {
      offset: offset.toString(16).padStart(8, '0'),
      hex: hexPairs.join(' '),
      ascii: text,
    };
    offset += 16;
    return row;
  });
}

export default function HexDump() {
  return (
    <div style={wrap}>
      <div style={header}>xxd suspicious_daemon | head</div>
      <div style={grid}>
        {HEX_ROWS.map((r, i) => (
          <div key={i} style={rowStyle}>
            <span style={{ color: 'var(--term-violet)' }}>{r.offset}</span>
            <span style={{ color: 'var(--term-text)' }}>{r.hex}</span>
            <span style={{ color: 'var(--term-accent)' }}>{r.ascii}</span>
          </div>
        ))}
      </div>
      <div style={footer}>8 rows shown · 0x80 bytes · the printable column knows things</div>
    </div>
  );
}

const wrap = { height: '100%', overflow: 'auto', padding: 16, fontFamily: 'var(--font-mono)', fontSize: 13, background: 'var(--term-bg)', color: 'var(--term-text)' };
const header = { color: 'var(--term-dim)', fontSize: 12, marginBottom: 12 };
const grid = { display: 'flex', flexDirection: 'column', gap: 3 };
const rowStyle = { display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 18, whiteSpace: 'pre' };
const footer = { color: 'var(--term-dim)', fontSize: 11, marginTop: 14 };
