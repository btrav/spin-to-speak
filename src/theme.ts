export type ThemeName = 'pastel' | 'paper' | 'streak' | 'blue-chip';

export interface ThemeConfig {
  label: string;
  isDark: boolean;
  root: string;
  card: string;
  cardHighlight: string;
  emptyWheelBg: string;
  modalBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  input: string;
  select: string;
  listItem: string;
  doneItem: string;
  doneText: string;
  removeBtn: string;
  rosterChip: string;
  rosterDelete: string;
  timerTrack: string;
  wheelColors: string[];
}

export const THEMES: Record<ThemeName, ThemeConfig> = {
  pastel: {
    label: 'Pastel',
    isDark: false,
    root: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
    card: 'bg-white/70 backdrop-blur-sm',
    cardHighlight: 'bg-white/70 backdrop-blur-sm border-2 border-green-400',
    emptyWheelBg: 'border-gray-300 bg-gradient-to-br from-blue-50 to-purple-50',
    modalBg: 'bg-white',
    textPrimary: 'text-gray-800',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-500',
    input: 'bg-white border-gray-200 text-gray-800 placeholder-gray-500',
    select: 'bg-white border-gray-200 text-gray-700',
    listItem: 'bg-gray-50 hover:bg-gray-100',
    doneItem: 'bg-green-50',
    doneText: 'text-green-700',
    removeBtn: 'text-red-500 hover:bg-red-100 hover:text-red-600',
    rosterChip: 'bg-indigo-50 text-indigo-700',
    rosterDelete: 'text-indigo-400',
    timerTrack: 'bg-gray-200',
    wheelColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2', '#A3E4D7', '#FAD7A0', '#D5A6BD', '#AED6F1', '#A9DFBF'],
  },
  paper: {
    label: 'Paper & Ink',
    isDark: false,
    root: 'bg-[#faf9f6]',
    card: 'bg-white border border-gray-200',
    cardHighlight: 'bg-white border-2 border-red-600',
    emptyWheelBg: 'border-gray-300 bg-gray-50',
    modalBg: 'bg-white border border-gray-200',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textMuted: 'text-gray-500',
    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
    select: 'bg-white border-gray-300 text-gray-700',
    listItem: 'bg-gray-50 hover:bg-gray-100',
    doneItem: 'bg-red-50',
    doneText: 'text-red-800',
    removeBtn: 'text-red-600 hover:bg-red-50 hover:text-red-700',
    rosterChip: 'bg-gray-100 text-gray-700',
    rosterDelete: 'text-gray-400',
    timerTrack: 'bg-gray-200',
    wheelColors: ['#DC2626', '#1F2937', '#6B7280', '#B91C1C', '#374151', '#9CA3AF', '#DC2626', '#1F2937', '#6B7280', '#B91C1C', '#374151', '#9CA3AF', '#DC2626', '#1F2937', '#6B7280', '#B91C1C', '#374151', '#9CA3AF', '#DC2626', '#1F2937'],
  },
  streak: {
    label: 'Streak',
    isDark: false,
    root: 'bg-white',
    card: 'bg-white border-2 border-gray-100',
    cardHighlight: 'bg-white border-2 border-[#58CC02]',
    emptyWheelBg: 'border-gray-200 bg-white',
    modalBg: 'bg-white',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    textMuted: 'text-gray-500',
    input: 'bg-white border-2 border-gray-200 text-gray-900 placeholder-gray-400',
    select: 'bg-white border-2 border-gray-200 text-gray-700',
    listItem: 'bg-gray-50 hover:bg-green-50',
    doneItem: 'bg-green-50',
    doneText: 'text-[#58CC02]',
    removeBtn: 'text-red-500 hover:bg-red-50 hover:text-red-600',
    rosterChip: 'bg-green-50 text-green-700',
    rosterDelete: 'text-green-400',
    timerTrack: 'bg-gray-200',
    wheelColors: ['#58CC02', '#1CB0F6', '#FF4B4B', '#FFC800', '#CE82FF', '#FF9600', '#2B70C9', '#00CD9C', '#FF86D0', '#58CC02', '#1CB0F6', '#FF4B4B', '#FFC800', '#CE82FF', '#FF9600', '#2B70C9', '#00CD9C', '#FF86D0', '#58CC02', '#1CB0F6'],
  },
  'blue-chip': {
    label: 'Blue Chip',
    isDark: true,
    root: 'bg-[#0a0b0d]',
    card: 'bg-[#141618] border border-[#262626]',
    cardHighlight: 'bg-[#141618] border border-[#0052FF]',
    emptyWheelBg: 'border-[#262626] bg-[#141618]',
    modalBg: 'bg-[#141618] border border-[#262626]',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-500',
    input: 'bg-[#1e2028] border-[#2d3038] text-white placeholder-gray-500',
    select: 'bg-[#1e2028] border-[#2d3038] text-white',
    listItem: 'bg-[#1a1c21] hover:bg-[#1e2028]',
    doneItem: 'bg-[#0a1628]',
    doneText: 'text-blue-400',
    removeBtn: 'text-red-400 hover:bg-red-900/20 hover:text-red-300',
    rosterChip: 'bg-[#0f1629] text-blue-400',
    rosterDelete: 'text-blue-500',
    timerTrack: 'bg-[#1e2028]',
    wheelColors: ['#0052FF', '#1A6FFF', '#3385FF', '#4D9AFF', '#0040CC', '#0030A0', '#003AD6', '#0047F5', '#1A66FF', '#3380FF', '#0052FF', '#1A6FFF', '#3385FF', '#4D9AFF', '#0040CC', '#0030A0', '#003AD6', '#0047F5', '#1A66FF', '#3380FF'],
  },
};
