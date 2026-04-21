// Shared data store - simulates a database with localStorage persistence

export interface VideoItem {
  id: string;
  title: string;
  subject: string;
  description: string;
  url: string;
  thumbnail?: string;
  uploadedBy: string;
  uploaderRole: "teacher" | "psychologist";
  uploaderName: string;
  createdAt: string;
  duration?: string;
  views: number;
}

export interface SessionItem {
  id: string;
  title: string;
  subject: string;
  description: string;
  zoomLink: string;
  scheduledAt: string;
  createdBy: string;
  creatorRole: "teacher" | "psychologist";
  creatorName: string;
  createdAt: string;
  isLive?: boolean;
}

const VIDEOS_KEY = "edu_videos";
const SESSIONS_KEY = "edu_sessions";

// Seed data
const seedVideos: VideoItem[] = [
  {
    id: "v1",
    title: "مقدمة في الرياضيات - المعادلات التربيعية",
    subject: "رياضيات",
    description: "شرح مفصل لحل المعادلات التربيعية بطرق مختلفة",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadedBy: "teacher1",
    uploaderRole: "teacher",
    uploaderName: "أ. محمد أمين",
    createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    duration: "24:30",
    views: 142,
  },
  {
    id: "v2",
    title: "قواعد اللغة العربية - الفعل والفاعل",
    subject: "عربية",
    description: "درس شامل حول الفعل والفاعل والمفعول به",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadedBy: "teacher1",
    uploaderRole: "teacher",
    uploaderName: "أ. محمد أمين",
    createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
    duration: "18:45",
    views: 89,
  },
  {
    id: "v3",
    title: "كيف تتعامل مع ضغوط الامتحانات",
    subject: "صحة نفسية",
    description: "تقنيات عملية للتخلص من التوتر والقلق قبل الامتحانات",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadedBy: "psych1",
    uploaderRole: "psychologist",
    uploaderName: "د. سارة بن عيسى",
    createdAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    duration: "15:20",
    views: 203,
  },
  {
    id: "v4",
    title: "تقوية الثقة بالنفس لدى التلاميذ",
    subject: "صحة نفسية",
    description: "استراتيجيات لبناء ثقة صحية وإيجابية لدى الأطفال",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    uploadedBy: "psych1",
    uploaderRole: "psychologist",
    uploaderName: "د. سارة بن عيسى",
    createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    duration: "20:10",
    views: 175,
  },
];

const seedSessions: SessionItem[] = [
  {
    id: "s1",
    title: "حصة الرياضيات - الأسبوع الثالث",
    subject: "رياضيات",
    description: "مراجعة شاملة للمقاطع الدراسية وحل التمارين",
    zoomLink: "https://zoom.us/j/123456789",
    scheduledAt: new Date(Date.now() + 2 * 3600000).toISOString(),
    createdBy: "teacher1",
    creatorRole: "teacher",
    creatorName: "أ. محمد أمين",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    isLive: true,
  },
  {
    id: "s2",
    title: "جلسة دعم نفسي جماعية",
    subject: "صحة نفسية",
    description: "جلسة مفتوحة للحديث عن مشاكل الدراسة والضغوط",
    zoomLink: "https://zoom.us/j/987654321",
    scheduledAt: new Date(Date.now() + 24 * 3600000).toISOString(),
    createdBy: "psych1",
    creatorRole: "psychologist",
    creatorName: "د. سارة بن عيسى",
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    isLive: false,
  },
  {
    id: "s3",
    title: "شرح الفيزياء - الفصل الثاني",
    subject: "فيزياء",
    description: "شرح قوانين الحركة ونيوتن للسنة الثالثة",
    zoomLink: "https://zoom.us/j/555666777",
    scheduledAt: new Date(Date.now() + 3 * 24 * 3600000).toISOString(),
    createdBy: "teacher1",
    creatorRole: "teacher",
    creatorName: "أ. محمد أمين",
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    isLive: false,
  },
];

function ensureSeed() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(VIDEOS_KEY)) {
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(seedVideos));
  }
  if (!localStorage.getItem(SESSIONS_KEY)) {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(seedSessions));
  }
}

export function getVideos(): VideoItem[] {
  ensureSeed();
  if (typeof window === "undefined") return seedVideos;
  const data = localStorage.getItem(VIDEOS_KEY);
  return data ? JSON.parse(data) : seedVideos;
}

export function getSessions(): SessionItem[] {
  ensureSeed();
  if (typeof window === "undefined") return seedSessions;
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : seedSessions;
}

export function addVideo(video: Omit<VideoItem, "id" | "createdAt" | "views">): VideoItem {
  const newVideo: VideoItem = {
    ...video,
    id: "v" + Date.now(),
    createdAt: new Date().toISOString(),
    views: 0,
  };
  const videos = getVideos();
  videos.unshift(newVideo);
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
  return newVideo;
}

export function addSession(session: Omit<SessionItem, "id" | "createdAt">): SessionItem {
  const newSession: SessionItem = {
    ...session,
    id: "s" + Date.now(),
    createdAt: new Date().toISOString(),
  };
  const sessions = getSessions();
  sessions.unshift(newSession);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  return newSession;
}

export function deleteVideo(id: string) {
  const videos = getVideos().filter(v => v.id !== id);
  localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
}

export function deleteSession(id: string) {
  const sessions = getSessions().filter(s => s.id !== id);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ar-DZ", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} دقيقة`;
  if (hrs < 24) return `منذ ${hrs} ساعة`;
  return `منذ ${days} يوم`;
}
