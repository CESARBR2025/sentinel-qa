export const inputBase = `
  w-full rounded-lg border border-slate-200 bg-white px-3 py-2
  text-sm text-slate-900 placeholder:text-slate-400
  focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15
  transition-all duration-200
  disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
`;

export const inputError = `
  w-full rounded-lg border border-red-400 bg-red-50 px-3 py-2
  text-sm text-slate-900 placeholder:text-slate-400
  focus:border-red-500 focus:ring-2 focus:ring-red-500/15 focus:outline-none
  transition-all duration-200
`;

export const selectBase =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-slate-50 disabled:text-slate-400';

export const selectError =
  'w-full rounded-lg border border-red-400 bg-red-50 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/15';
