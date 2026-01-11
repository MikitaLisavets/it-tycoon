
export interface Quiz {
    questionKey: string;
    optionKeys: string[];
    answer: number; // index
}

export interface EducationPart {
    id: string;
    title: string;
    cost: number;
    duration: number; // in seconds
    quizzes: Quiz[];
}

export interface EducationTrack {
    id: string;
    title: string;
    parts: EducationPart[];
    requirements?: {
        education?: string; // ID of previous education
    };
}

const generateQuizzes = (prefix: string, answers: number[], optionsCounts?: number[]): Quiz[] => {
    return answers.map((answer, index) => {
        const qNum = index + 1;
        const count = optionsCounts?.[index] || 4;
        return {
            questionKey: `Quizzes.${prefix}_q${qNum}`,
            optionKeys: Array.from({ length: count }, (_, i) => `Quizzes.${prefix}_q${qNum}_opt${i + 1}`),
            answer
        };
    });
};

export const EDUCATION_TRACKS: EducationTrack[] = [
    {
        id: 'school',
        title: 'High School',
        parts: [
            {
                id: 'school_part_1',
                title: 'Logic & Reasoning',
                cost: 50,
                duration: 10,
                quizzes: generateQuizzes('school_part_1', [1, 1, 2, 1, 0, 0, 2, 0, 2, 1])
            },
            {
                id: 'school_part_2',
                title: 'Natural Sciences',
                cost: 75,
                duration: 15,
                quizzes: generateQuizzes('school_part_2', [0, 2, 2, 2, 2, 2, 0, 2, 0, 2])
            },
            {
                id: 'school_part_3',
                title: 'Computer Basics',
                cost: 100,
                duration: 20,
                quizzes: generateQuizzes('school_part_3', [2, 0, 3, 0, 2, 1, 2, 2, 1, 3])
            },
            {
                id: 'school_part_4',
                title: 'Hardware Basics',
                cost: 200,
                duration: 25,
                quizzes: generateQuizzes('school_part_4', [2, 2, 1, 0, 2, 2, 1, 0, 1, 1])
            },
        ]
    },
    {
        id: 'college',
        title: 'Technical College',
        requirements: { education: 'school' },
        parts: [
            {
                id: 'college_part_1',
                title: 'Algorithms 101',
                cost: 800,
                duration: 25,
                quizzes: generateQuizzes('college_part_1', [3, 0, 2, 0, 1, 1, 0, 1, 1, 3])
            },
            {
                id: 'college_part_2',
                title: 'Web Development Basics',
                cost: 1200,
                duration: 30,
                quizzes: generateQuizzes('college_part_2', [1, 0, 1, 2, 0, 2, 1, 0, 2, 0])
            },
            {
                id: 'college_part_3',
                title: 'Database Fundamentals',
                cost: 1800,
                duration: 35,
                quizzes: generateQuizzes('college_part_3', [2, 1, 0, 1, 1, 1, 0, 0, 2, 0])
            },
            {
                id: 'college_part_4',
                title: 'Networking Essentials',
                cost: 2500,
                duration: 40,
                quizzes: generateQuizzes('college_part_4', [2, 0, 2, 1, 1, 2, 0, 1, 1, 0])
            },
            {
                id: 'college_part_5',
                title: 'Operating Systems',
                cost: 3500,
                duration: 45,
                quizzes: generateQuizzes('college_part_5', [2, 1, 0, 1, 0, 0, 0, 1, 0, 1])
            },
            {
                id: 'college_part_6',
                title: 'Software Engineering',
                cost: 5000,
                duration: 50,
                quizzes: generateQuizzes('college_part_6', [1, 1, 1, 1, 0, 1, 1, 1, 0, 1])
            },
        ]
    },
    {
        id: 'university',
        title: 'University of Technology',
        requirements: { education: 'college' },
        parts: [
            {
                id: 'uni_part_1',
                title: 'Advanced Data Structures',
                cost: 8000,
                duration: 50,
                quizzes: generateQuizzes('uni_part_1', [2, 1, 1, 0, 1, 1, 0, 1, 0, 2])
            },
            {
                id: 'uni_part_2',
                title: 'Artificial Intelligence',
                cost: 12000,
                duration: 60,
                quizzes: generateQuizzes('uni_part_2', [2, 1, 1, 0, 0, 1, 0, 1, 0, 1])
            },
            {
                id: 'uni_part_3',
                title: 'Compiler Design',
                cost: 18000,
                duration: 70,
                quizzes: generateQuizzes('uni_part_3', [1, 1, 1, 0, 0, 0, 1, 0, 0, 0])
            },
            {
                id: 'uni_part_4',
                title: 'Distributed Systems',
                cost: 25000,
                duration: 80,
                quizzes: generateQuizzes('uni_part_4', [2, 1, 0, 0, 0, 1, 0, 0, 1, 1])
            },
            {
                id: 'uni_part_5',
                title: 'Cybersecurity',
                cost: 40000,
                duration: 90,
                quizzes: generateQuizzes('uni_part_5', [2, 1, 0, 1, 1, 1, 1, 1, 1, 1])
            },
            {
                id: 'uni_part_6',
                title: 'Cloud Computing',
                cost: 60000,
                duration: 100,
                quizzes: generateQuizzes('uni_part_6', [0, 0, 1, 0, 1, 1, 2, 1, 1, 1])
            },
            {
                id: 'uni_part_7',
                title: 'Master Thesis',
                cost: 100000,
                duration: 120,
                quizzes: generateQuizzes('uni_part_7', [1, 1, 1, 0, 1, 1, 1, 1, 1, 1])
            }
        ]
    }
];
