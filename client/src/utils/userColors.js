// A palette of distinct, readable colors on a dark background.
// Red/rose are deliberately excluded so member colors never get
// confused with the red "not submitted" status dots elsewhere in the app.
const PALETTE = [
  { bg: 'bg-blue-500/15', border: 'border-blue-500/40' },
  { bg: 'bg-purple-500/15', border: 'border-purple-500/40' },
  { bg: 'bg-yellow-500/15', border: 'border-yellow-500/40' },
  { bg: 'bg-pink-500/15', border: 'border-pink-500/40' },
  { bg: 'bg-cyan-500/15', border: 'border-cyan-500/40' },
  { bg: 'bg-orange-500/15', border: 'border-orange-500/40' },
  { bg: 'bg-teal-500/15', border: 'border-teal-500/40' },
  { bg: 'bg-lime-500/15', border: 'border-lime-500/40' },
  { bg: 'bg-indigo-500/15', border: 'border-indigo-500/40' },
  { bg: 'bg-sky-500/15', border: 'border-sky-500/40' },
];

// Turns a user ID into a consistent index into the palette above,
// so the same person always gets the same color every time.
export function getUserColor(userId) {
  if (!userId) return PALETTE[0];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i);
    hash |= 0; // keep it a 32-bit int
  }

  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}