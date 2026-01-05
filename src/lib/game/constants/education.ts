
export interface Quiz {
    question: string;
    options: string[];
    answer: number; // index
}

export interface EducationPart {
    id: string;
    title: string;
    cost: number;
    duration: number; // in seconds
    quiz: Quiz;
}

export interface EducationTrack {
    id: string;
    title: string;
    parts: EducationPart[];
    requirements?: {
        education?: string; // ID of previous education
    };
}

export const EDUCATION_TRACKS: EducationTrack[] = [
    {
        id: 'school',
        title: 'High School',
        parts: [
            {
                id: 'school_part_1',
                title: 'Mathematics & Logic Basics',
                cost: 50,
                duration: 10,
                quiz: {
                    question: 'If 2x + 5 = 15, what is x?',
                    options: ['3', '5', '7', '10'],
                    answer: 1
                }
            },
            {
                id: 'school_part_2',
                title: 'Natural Sciences',
                cost: 75,
                duration: 15,
                quiz: {
                    question: 'Which of these is NOT a primary color?',
                    options: ['Red', 'Blue', 'Green', 'Yellow'],
                    answer: 2
                }
            }
        ]
    },
    {
        id: 'college',
        title: 'Technical College',
        requirements: { education: 'school' },
        parts: [
            {
                id: 'college_part_1',
                title: 'Computer Architecture',
                cost: 200,
                duration: 20,
                quiz: {
                    question: 'What does CPU stand for?',
                    options: ['Central Process Unit', 'Computer Personal Unit', 'Central Processing Unit', 'Central Peripheral Unit'],
                    answer: 2
                }
            },
            {
                id: 'college_part_2',
                title: 'Algorithms 101',
                cost: 300,
                duration: 25,
                quiz: {
                    question: 'What is the next number in the sequence: 1, 1, 2, 3, 5, 8, ...?',
                    options: ['10', '11', '12', '13'],
                    answer: 3
                }
            }
        ]
    },
    {
        id: 'university',
        title: 'University of Technology',
        requirements: { education: 'college' },
        parts: [
            {
                id: 'uni_part_1',
                title: 'Software Engineering',
                cost: 800,
                duration: 40,
                quiz: {
                    question: 'Which of these is a valid Big O notation for Binary Search?',
                    options: ['O(n)', 'O(log n)', 'O(n^2)', 'O(1)'],
                    answer: 1
                }
            },
            {
                id: 'uni_part_2',
                title: 'Data Structures',
                cost: 1200,
                duration: 50,
                quiz: {
                    question: 'Which data structure follows LIFO?',
                    options: ['Queue', 'Linked List', 'Stack', 'Tree'],
                    answer: 2
                }
            },
            {
                id: 'uni_part_3',
                title: 'Artificial Intelligence',
                cost: 2000,
                duration: 60,
                quiz: {
                    question: 'What is the Turing Test used to determine?',
                    options: ['CPU Speed', 'Memory Capacity', 'Machine Intelligence', 'Network Latency'],
                    answer: 2
                }
            }
        ]
    }
];
