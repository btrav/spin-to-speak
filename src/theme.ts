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
  titleClass: string;
  spinBtnActive: string;
  addBtn: string;
  resetBtn: string;
  markDoneBtn: string;
  newMeetingBtn: string;
  saveRosterBtn: string;
  avatarGradient: string;
  doneAvatarGradient: string;
  speakerAvatarGradient: string;
  wheelCenterDot: string;
  accentBg: string;
  accentText: string;
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
    titleClass: 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent',
    spinBtnActive: 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:scale-105 hover:shadow-xl animate-pulse-slow',
    addBtn: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:scale-105',
    resetBtn: 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:scale-105',
    markDoneBtn: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:scale-105',
    newMeetingBtn: 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 hover:scale-105',
    saveRosterBtn: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 hover:scale-105',
    avatarGradient: 'from-blue-400 to-purple-400',
    doneAvatarGradient: 'from-green-400 to-emerald-400',
    speakerAvatarGradient: 'from-green-400 to-blue-500',
    wheelCenterDot: 'from-blue-500 to-purple-500',
    accentBg: 'bg-green-500',
    accentText: 'text-green-500',
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
    titleClass: 'text-gray-900',
    spinBtnActive: 'bg-gray-900 text-white hover:bg-gray-700 hover:scale-105 hover:shadow-xl animate-pulse-slow',
    addBtn: 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-105',
    resetBtn: 'bg-red-600 text-white hover:bg-red-700 hover:scale-105',
    markDoneBtn: 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-105',
    newMeetingBtn: 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-105',
    saveRosterBtn: 'bg-gray-800 text-white hover:bg-gray-700 hover:scale-105',
    avatarGradient: 'from-gray-600 to-gray-800',
    doneAvatarGradient: 'from-red-600 to-red-800',
    speakerAvatarGradient: 'from-gray-700 to-gray-900',
    wheelCenterDot: 'from-gray-700 to-gray-900',
    accentBg: 'bg-red-600',
    accentText: 'text-red-600',
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
    titleClass: 'text-[#58CC02]',
    spinBtnActive: 'bg-[#58CC02] text-white hover:bg-[#46A302] hover:scale-105 hover:shadow-xl animate-pulse-slow',
    addBtn: 'bg-[#1CB0F6] text-white hover:bg-[#15A0DF] hover:scale-105',
    resetBtn: 'bg-[#FF4B4B] text-white hover:bg-[#E04040] hover:scale-105',
    markDoneBtn: 'bg-[#58CC02] text-white hover:bg-[#46A302] hover:scale-105',
    newMeetingBtn: 'bg-[#58CC02] text-white hover:bg-[#46A302] hover:scale-105',
    saveRosterBtn: 'bg-[#1CB0F6] text-white hover:bg-[#15A0DF] hover:scale-105',
    avatarGradient: 'from-[#58CC02] to-[#1CB0F6]',
    doneAvatarGradient: 'from-[#58CC02] to-emerald-500',
    speakerAvatarGradient: 'from-[#58CC02] to-[#1CB0F6]',
    wheelCenterDot: 'from-[#58CC02] to-[#1CB0F6]',
    accentBg: 'bg-[#58CC02]',
    accentText: 'text-[#58CC02]',
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
    titleClass: 'text-white',
    spinBtnActive: 'bg-[#0052FF] text-white hover:bg-[#003AD6] hover:scale-105 hover:shadow-xl animate-pulse-slow',
    addBtn: 'bg-[#0052FF] text-white hover:bg-[#003AD6] hover:scale-105',
    resetBtn: 'bg-[#1e2028] border border-[#2d3038] text-gray-200 hover:bg-[#262626] hover:scale-105',
    markDoneBtn: 'bg-[#0052FF] text-white hover:bg-[#003AD6] hover:scale-105',
    newMeetingBtn: 'bg-[#0052FF] text-white hover:bg-[#003AD6] hover:scale-105',
    saveRosterBtn: 'bg-[#0052FF] text-white hover:bg-[#003AD6] hover:scale-105',
    avatarGradient: 'from-[#0052FF] to-[#1A6FFF]',
    doneAvatarGradient: 'from-blue-500 to-blue-700',
    speakerAvatarGradient: 'from-[#0052FF] to-[#1A6FFF]',
    wheelCenterDot: 'from-[#0052FF] to-[#1A6FFF]',
    accentBg: 'bg-[#0052FF]',
    accentText: 'text-[#0052FF]',
  },
};
