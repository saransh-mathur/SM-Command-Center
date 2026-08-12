export type ServiceStatus = 'active' | 'disabled' | 'loading';

export type ActiveView = 'cockpit' | 'career' | 'courses' | 'mba';

export type EnergyMode = 'morning' | 'midday' | 'evening';

export interface TelemetryData {
 time: string;
 cpuTemp: number;
 cpuLoad: number;
 gpuTemp: number;
 ramUsed: number;
 ramTotal: number;
 ramPercent: number;
 swapUsed: number;
 swapTotal: number;
 swapPercent: number;
 fanRpm: number;
 fanMode: 'Auto' | 'Performance' | 'Quiet' | 'Manual';
 batteryPercent: number;
 isCharging: boolean;
 powerDrawWatts: number;
}

export interface DailyTargets {
 applications: { current: number; target: number };
 udemySprints: { current: number; target: number };
 mbaRecall: { current: number; target: number };
 deepCoding: { current: number; target: number };
 deepDevBlocks: { current: number; target: number };
}

export interface DSAPattern {
 id: string;
 name: string;
 difficulty: 'Core' | 'Medium' | 'Advanced';
 frequency: 'High' | 'Very High' | 'Crucial';
 takeaway: string;
 timeComplexity: string;
 spaceComplexity: string;
 codeSnippet: string;
 link: string;
 exampleProblem: string;
}

export interface MBACard {
 id: string;
 subject: string;
 topic: string;
 question: string;
 answer: string;
 formulaOrInsight: string;
}

export interface PREPQuestion {
 id: string;
 type: 'PREP' | 'STAR';
 category: 'Backend / Django' | 'System Design' | 'AI / RAG' | 'Behavioral / Leadership';
 prompt: string;
 sampleStructure: {
 pointOrSituation: string;
 reasonOrTask: string;
 exampleOrAction: string;
 pointOrResult: string;
 };
}

export interface DockerContainer {
 id: string;
 name: string;
 image: string;
 status: 'running' | 'stopped' | 'idle';
 port?: string;
 memoryUsage: string;
}

export interface ToastMessage {
 id: string;
 type: 'success' | 'info' | 'warning' | 'error';
 title: string;
 message: string;
}

export type AdvisorId = 'ren' | 'sky' | 'tsuna';

// Career & Job Hunt Types
export type JobStage = 'targeted' | 'tailored' | 'outreach' | 'interview' | 'offer';

export interface CareerApplication {
 id: string;
 company: string;
 role: string;
 salaryRange?: string;
 location: string;
 stage: JobStage;
 dateAdded: string;
 notes?: string;
 url?: string;
 tags: string[];
}

export interface OutreachTemplate {
 id: string;
 title: string;
 category: 'recruiter' | 'hiring_manager' | 'alumni' | 'followup';
 subject: string;
 body: string;
 tags: string[];
}

export interface StarProject {
 id: string;
 title: string;
 role: string;
 timeframe: string;
 summary: string;
 impactMetrics: string[];
 techStack: string[];
 githubUrl?: string;
 liveUrl?: string;
}

// Udemy & Course Lab Types
export interface UdemyCourse {
 id: string;
 title: string;
 instructor: string;
 platform: 'Udemy' | 'Coursera' | 'Masterclass' | 'Self-Paced';
 totalLessons: number;
 completedLessons: number;
 currentModule: string;
 currentLessonTitle: string;
 category: 'Backend' | 'System Design' | 'AI / ML' | 'DevOps';
 estimatedHoursLeft: number;
 url: string;
}

export interface CourseCheatSheet {
 id: string;
 topic: string;
 category: string;
 mentalModelBullets: string[];
 codeChallenge: {
 title: string;
 prompt: string;
 starterCode: string;
 solution: string;
 };
 activeRecallQuestions: string[];
}

// Anti-Procrastination Roulette Types
export interface RouletteTask {
 id: string;
 track: 'job' | 'udemy' | 'mba';
 title: string;
 description: string;
 estimatedMinutes: number;
 actionUrl?: string;
 actionText: string;
 advisorTip: string;
 targetKey: keyof DailyTargets;
}
