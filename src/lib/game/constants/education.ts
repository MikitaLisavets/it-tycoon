
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

export const EDUCATION_TRACKS: EducationTrack[] = [
    {
        id: 'school',
        title: 'High School',
        parts: [
            {
                id: 'school_part_1',
                title: 'Mathematics Basics',
                cost: 50,
                duration: 10,
                quizzes: [
                    { questionKey: 'Quizzes.school_part_1_q1', optionKeys: ['Quizzes.school_part_1_q1_opt1', 'Quizzes.school_part_1_q1_opt2', 'Quizzes.school_part_1_q1_opt3', 'Quizzes.school_part_1_q1_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.school_part_1_q2', optionKeys: ['Quizzes.school_part_1_q2_opt1', 'Quizzes.school_part_1_q2_opt2', 'Quizzes.school_part_1_q2_opt3', 'Quizzes.school_part_1_q2_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.school_part_1_q3', optionKeys: ['Quizzes.school_part_1_q3_opt1', 'Quizzes.school_part_1_q3_opt2', 'Quizzes.school_part_1_q3_opt3', 'Quizzes.school_part_1_q3_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_1_q4', optionKeys: ['Quizzes.school_part_1_q4_opt1', 'Quizzes.school_part_1_q4_opt2', 'Quizzes.school_part_1_q4_opt3', 'Quizzes.school_part_1_q4_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_1_q5', optionKeys: ['Quizzes.school_part_1_q5_opt1', 'Quizzes.school_part_1_q5_opt2', 'Quizzes.school_part_1_q5_opt3', 'Quizzes.school_part_1_q5_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.school_part_1_q6', optionKeys: ['Quizzes.school_part_1_q6_opt1', 'Quizzes.school_part_1_q6_opt2', 'Quizzes.school_part_1_q6_opt3', 'Quizzes.school_part_1_q6_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_1_q7', optionKeys: ['Quizzes.school_part_1_q7_opt1', 'Quizzes.school_part_1_q7_opt2', 'Quizzes.school_part_1_q7_opt3', 'Quizzes.school_part_1_q7_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_1_q8', optionKeys: ['Quizzes.school_part_1_q8_opt1', 'Quizzes.school_part_1_q8_opt2', 'Quizzes.school_part_1_q8_opt3', 'Quizzes.school_part_1_q8_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_1_q9', optionKeys: ['Quizzes.school_part_1_q9_opt1', 'Quizzes.school_part_1_q9_opt2', 'Quizzes.school_part_1_q9_opt3', 'Quizzes.school_part_1_q9_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.school_part_1_q10', optionKeys: ['Quizzes.school_part_1_q10_opt1', 'Quizzes.school_part_1_q10_opt2', 'Quizzes.school_part_1_q10_opt3', 'Quizzes.school_part_1_q10_opt4'], answer: 2 }
                ]
            },
            {
                id: 'school_part_2',
                title: 'Logic & Reasoning',
                cost: 75,
                duration: 15,
                quizzes: [
                    { questionKey: 'Quizzes.school_part_1_q1', optionKeys: ['Quizzes.school_part_1_q1_opt1', 'Quizzes.school_part_1_q1_opt2', 'Quizzes.school_part_1_q1_opt3', 'Quizzes.school_part_1_q1_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.school_part_1_q2', optionKeys: ['Quizzes.school_part_1_q2_opt1', 'Quizzes.school_part_1_q2_opt2', 'Quizzes.school_part_1_q2_opt3', 'Quizzes.school_part_1_q2_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.school_part_1_q3', optionKeys: ['Quizzes.school_part_1_q3_opt1', 'Quizzes.school_part_1_q3_opt2', 'Quizzes.school_part_1_q3_opt3', 'Quizzes.school_part_1_q3_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_1_q4', optionKeys: ['Quizzes.school_part_1_q4_opt1', 'Quizzes.school_part_1_q4_opt2', 'Quizzes.school_part_1_q4_opt3', 'Quizzes.school_part_1_q4_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.school_part_1_q5', optionKeys: ['Quizzes.school_part_1_q5_opt1', 'Quizzes.school_part_1_q5_opt2', 'Quizzes.school_part_1_q5_opt3', 'Quizzes.school_part_1_q5_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_1_q6', optionKeys: ['Quizzes.school_part_1_q6_opt1', 'Quizzes.school_part_1_q6_opt2', 'Quizzes.school_part_1_q6_opt3', 'Quizzes.school_part_1_q6_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_1_q7', optionKeys: ['Quizzes.school_part_1_q7_opt1', 'Quizzes.school_part_1_q7_opt2', 'Quizzes.school_part_1_q7_opt3', 'Quizzes.school_part_1_q7_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_1_q8', optionKeys: ['Quizzes.school_part_1_q8_opt1', 'Quizzes.school_part_1_q8_opt2', 'Quizzes.school_part_1_q8_opt3', 'Quizzes.school_part_1_q8_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_1_q9', optionKeys: ['Quizzes.school_part_1_q9_opt1', 'Quizzes.school_part_1_q9_opt2', 'Quizzes.school_part_1_q9_opt3', 'Quizzes.school_part_1_q9_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_1_q10', optionKeys: ['Quizzes.school_part_1_q10_opt1', 'Quizzes.school_part_1_q10_opt2', 'Quizzes.school_part_1_q10_opt3', 'Quizzes.school_part_1_q10_opt4'], answer: 1 }
                ]
            },
            {
                id: 'school_part_3',
                title: 'Natural Sciences',
                cost: 100,
                duration: 20,
                quizzes: [
                    { questionKey: 'Quizzes.school_part_2_q1', optionKeys: ['Quizzes.school_part_2_q1_opt1', 'Quizzes.school_part_2_q1_opt2', 'Quizzes.school_part_2_q1_opt3', 'Quizzes.school_part_2_q1_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_2_q2', optionKeys: ['Quizzes.school_part_2_q2_opt1', 'Quizzes.school_part_2_q2_opt2', 'Quizzes.school_part_2_q2_opt3', 'Quizzes.school_part_2_q2_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_2_q3', optionKeys: ['Quizzes.school_part_2_q3_opt1', 'Quizzes.school_part_2_q3_opt2', 'Quizzes.school_part_2_q3_opt3', 'Quizzes.school_part_2_q3_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_2_q4', optionKeys: ['Quizzes.school_part_2_q4_opt1', 'Quizzes.school_part_2_q4_opt2', 'Quizzes.school_part_2_q4_opt3', 'Quizzes.school_part_2_q4_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_2_q5', optionKeys: ['Quizzes.school_part_2_q5_opt1', 'Quizzes.school_part_2_q5_opt2', 'Quizzes.school_part_2_q5_opt3', 'Quizzes.school_part_2_q5_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_2_q6', optionKeys: ['Quizzes.school_part_2_q6_opt1', 'Quizzes.school_part_2_q6_opt2', 'Quizzes.school_part_2_q6_opt3', 'Quizzes.school_part_2_q6_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_2_q7', optionKeys: ['Quizzes.school_part_2_q7_opt1', 'Quizzes.school_part_2_q7_opt2', 'Quizzes.school_part_2_q7_opt3', 'Quizzes.school_part_2_q7_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_2_q8', optionKeys: ['Quizzes.school_part_2_q8_opt1', 'Quizzes.school_part_2_q8_opt2', 'Quizzes.school_part_2_q8_opt3', 'Quizzes.school_part_2_q8_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_2_q9', optionKeys: ['Quizzes.school_part_2_q9_opt1', 'Quizzes.school_part_2_q9_opt2', 'Quizzes.school_part_2_q9_opt3', 'Quizzes.school_part_2_q9_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_2_q10', optionKeys: ['Quizzes.school_part_2_q10_opt1', 'Quizzes.school_part_2_q10_opt2', 'Quizzes.school_part_2_q10_opt3', 'Quizzes.school_part_2_q10_opt4'], answer: 2 }
                ]
            },
            {
                id: 'school_part_4',
                title: 'Intro to Computers',
                cost: 150,
                duration: 25,
                quizzes: [
                    { questionKey: 'Quizzes.school_part_3_q1', optionKeys: ['Quizzes.school_part_3_q1_opt1', 'Quizzes.school_part_3_q1_opt2', 'Quizzes.school_part_3_q1_opt3', 'Quizzes.school_part_3_q1_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_3_q2', optionKeys: ['Quizzes.school_part_3_q2_opt1', 'Quizzes.school_part_3_q2_opt2', 'Quizzes.school_part_3_q2_opt3', 'Quizzes.school_part_3_q2_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_3_q3', optionKeys: ['Quizzes.school_part_3_q3_opt1', 'Quizzes.school_part_3_q3_opt2', 'Quizzes.school_part_3_q3_opt3', 'Quizzes.school_part_3_q3_opt4'], answer: 3 },
                    { questionKey: 'Quizzes.school_part_3_q4', optionKeys: ['Quizzes.school_part_3_q4_opt1', 'Quizzes.school_part_3_q4_opt2', 'Quizzes.school_part_3_q4_opt3', 'Quizzes.school_part_3_q4_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_3_q5', optionKeys: ['Quizzes.school_part_3_q5_opt1', 'Quizzes.school_part_3_q5_opt2', 'Quizzes.school_part_3_q5_opt3', 'Quizzes.school_part_3_q5_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_3_q6', optionKeys: ['Quizzes.school_part_3_q6_opt1', 'Quizzes.school_part_3_q6_opt2', 'Quizzes.school_part_3_q6_opt3', 'Quizzes.school_part_3_q6_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.school_part_3_q7', optionKeys: ['Quizzes.school_part_3_q7_opt1', 'Quizzes.school_part_3_q7_opt2', 'Quizzes.school_part_3_q7_opt3', 'Quizzes.school_part_3_q7_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_3_q8', optionKeys: ['Quizzes.school_part_3_q8_opt1', 'Quizzes.school_part_3_q8_opt2', 'Quizzes.school_part_3_q8_opt3', 'Quizzes.school_part_3_q8_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_3_q9', optionKeys: ['Quizzes.school_part_3_q9_opt1', 'Quizzes.school_part_3_q9_opt2', 'Quizzes.school_part_3_q9_opt3', 'Quizzes.school_part_3_q9_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.school_part_3_q10', optionKeys: ['Quizzes.school_part_3_q10_opt1', 'Quizzes.school_part_3_q10_opt2', 'Quizzes.school_part_3_q10_opt3', 'Quizzes.school_part_3_q10_opt4'], answer: 3 }
                ]
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
                quizzes: [
                    { questionKey: 'Quizzes.school_part_4_q1', optionKeys: ['Quizzes.school_part_4_q1_opt1', 'Quizzes.school_part_4_q1_opt2', 'Quizzes.school_part_4_q1_opt3', 'Quizzes.school_part_4_q1_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_4_q2', optionKeys: ['Quizzes.school_part_4_q2_opt1', 'Quizzes.school_part_4_q2_opt2', 'Quizzes.school_part_4_q2_opt3', 'Quizzes.school_part_4_q2_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_4_q3', optionKeys: ['Quizzes.school_part_4_q3_opt1', 'Quizzes.school_part_4_q3_opt2', 'Quizzes.school_part_4_q3_opt3', 'Quizzes.school_part_4_q3_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.school_part_4_q4', optionKeys: ['Quizzes.school_part_4_q4_opt1', 'Quizzes.school_part_4_q4_opt2', 'Quizzes.school_part_4_q4_opt3', 'Quizzes.school_part_4_q4_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_4_q5', optionKeys: ['Quizzes.school_part_4_q5_opt1', 'Quizzes.school_part_4_q5_opt2', 'Quizzes.school_part_4_q5_opt3', 'Quizzes.school_part_4_q5_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_4_q6', optionKeys: ['Quizzes.school_part_4_q6_opt1', 'Quizzes.school_part_4_q6_opt2', 'Quizzes.school_part_4_q6_opt3', 'Quizzes.school_part_4_q6_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.school_part_4_q7', optionKeys: ['Quizzes.school_part_4_q7_opt1', 'Quizzes.school_part_4_q7_opt2', 'Quizzes.school_part_4_q7_opt3', 'Quizzes.school_part_4_q7_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.school_part_4_q8', optionKeys: ['Quizzes.school_part_4_q8_opt1', 'Quizzes.school_part_4_q8_opt2', 'Quizzes.school_part_4_q8_opt3', 'Quizzes.school_part_4_q8_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.school_part_4_q9', optionKeys: ['Quizzes.school_part_4_q9_opt1', 'Quizzes.school_part_4_q9_opt2', 'Quizzes.school_part_4_q9_opt3', 'Quizzes.school_part_4_q9_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.school_part_4_q10', optionKeys: ['Quizzes.school_part_4_q10_opt1', 'Quizzes.school_part_4_q10_opt2', 'Quizzes.school_part_4_q10_opt3', 'Quizzes.school_part_4_q10_opt4'], answer: 1 }
                ]
            },
            {
                id: 'college_part_2',
                title: 'Algorithms 101',
                cost: 300,
                duration: 25,
                quizzes: [
                    { questionKey: 'Quizzes.college_part_1_q1', optionKeys: ['Quizzes.college_part_1_q1_opt1', 'Quizzes.college_part_1_q1_opt2', 'Quizzes.college_part_1_q1_opt3', 'Quizzes.college_part_1_q1_opt4'], answer: 3 },
                    { questionKey: 'Quizzes.college_part_1_q2', optionKeys: ['Quizzes.college_part_1_q2_opt1', 'Quizzes.college_part_1_q2_opt2', 'Quizzes.college_part_1_q2_opt3', 'Quizzes.college_part_1_q2_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_1_q3', optionKeys: ['Quizzes.college_part_1_q3_opt1', 'Quizzes.college_part_1_q3_opt2', 'Quizzes.college_part_1_q3_opt3', 'Quizzes.college_part_1_q3_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.college_part_1_q4', optionKeys: ['Quizzes.college_part_1_q4_opt1', 'Quizzes.college_part_1_q4_opt2', 'Quizzes.college_part_1_q4_opt3', 'Quizzes.college_part_1_q4_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_1_q5', optionKeys: ['Quizzes.college_part_1_q5_opt1', 'Quizzes.college_part_1_q5_opt2', 'Quizzes.college_part_1_q5_opt3', 'Quizzes.college_part_1_q5_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_1_q6', optionKeys: ['Quizzes.college_part_1_q6_opt1', 'Quizzes.college_part_1_q6_opt2', 'Quizzes.college_part_1_q6_opt3', 'Quizzes.college_part_1_q6_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_1_q7', optionKeys: ['Quizzes.college_part_1_q7_opt1', 'Quizzes.college_part_1_q7_opt2', 'Quizzes.college_part_1_q7_opt3', 'Quizzes.college_part_1_q7_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_1_q8', optionKeys: ['Quizzes.college_part_1_q8_opt1', 'Quizzes.college_part_1_q8_opt2', 'Quizzes.college_part_1_q8_opt3', 'Quizzes.college_part_1_q8_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_1_q9', optionKeys: ['Quizzes.college_part_1_q9_opt1', 'Quizzes.college_part_1_q9_opt2', 'Quizzes.college_part_1_q9_opt3', 'Quizzes.college_part_1_q9_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_1_q10', optionKeys: ['Quizzes.college_part_1_q10_opt1', 'Quizzes.college_part_1_q10_opt2', 'Quizzes.college_part_1_q10_opt3', 'Quizzes.college_part_1_q10_opt4'], answer: 3 }
                ]
            },
            {
                id: 'college_part_3',
                title: 'Web Development Basics',
                cost: 400,
                duration: 30,
                quizzes: [
                    { questionKey: 'Quizzes.college_part_2_q1', optionKeys: ['Quizzes.college_part_2_q1_opt1', 'Quizzes.college_part_2_q1_opt2', 'Quizzes.college_part_2_q1_opt3', 'Quizzes.college_part_2_q1_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_2_q2', optionKeys: ['Quizzes.college_part_2_q2_opt1', 'Quizzes.college_part_2_q2_opt2', 'Quizzes.college_part_2_q2_opt3', 'Quizzes.college_part_2_q2_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_2_q3', optionKeys: ['Quizzes.college_part_2_q3_opt1', 'Quizzes.college_part_2_q3_opt2', 'Quizzes.college_part_2_q3_opt3', 'Quizzes.college_part_2_q3_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_2_q4', optionKeys: ['Quizzes.college_part_2_q4_opt1', 'Quizzes.college_part_2_q4_opt2', 'Quizzes.college_part_2_q4_opt3', 'Quizzes.college_part_2_q4_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.college_part_2_q5', optionKeys: ['Quizzes.college_part_2_q5_opt1', 'Quizzes.college_part_2_q5_opt2', 'Quizzes.college_part_2_q5_opt3', 'Quizzes.college_part_2_q5_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_2_q6', optionKeys: ['Quizzes.college_part_2_q6_opt1', 'Quizzes.college_part_2_q6_opt2', 'Quizzes.college_part_2_q6_opt3', 'Quizzes.college_part_2_q6_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.college_part_2_q7', optionKeys: ['Quizzes.college_part_2_q7_opt1', 'Quizzes.college_part_2_q7_opt2', 'Quizzes.college_part_2_q7_opt3', 'Quizzes.college_part_2_q7_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_2_q8', optionKeys: ['Quizzes.college_part_2_q8_opt1', 'Quizzes.college_part_2_q8_opt2', 'Quizzes.college_part_2_q8_opt3', 'Quizzes.college_part_2_q8_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_2_q9', optionKeys: ['Quizzes.college_part_2_q9_opt1', 'Quizzes.college_part_2_q9_opt2', 'Quizzes.college_part_2_q9_opt3', 'Quizzes.college_part_2_q9_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.college_part_2_q10', optionKeys: ['Quizzes.college_part_2_q10_opt1', 'Quizzes.college_part_2_q10_opt2', 'Quizzes.college_part_2_q10_opt3', 'Quizzes.college_part_2_q10_opt4'], answer: 0 }
                ]
            },
            {
                id: 'college_part_4',
                title: 'Database Fundamentals',
                cost: 500,
                duration: 35,
                quizzes: [
                    { questionKey: 'Quizzes.college_part_3_q1', optionKeys: ['Quizzes.college_part_3_q1_opt1', 'Quizzes.college_part_3_q1_opt2', 'Quizzes.college_part_3_q1_opt3', 'Quizzes.college_part_3_q1_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.college_part_3_q2', optionKeys: ['Quizzes.college_part_3_q2_opt1', 'Quizzes.college_part_3_q2_opt2', 'Quizzes.college_part_3_q2_opt3', 'Quizzes.college_part_3_q2_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_3_q3', optionKeys: ['Quizzes.college_part_3_q3_opt1', 'Quizzes.college_part_3_q3_opt2', 'Quizzes.college_part_3_q3_opt3', 'Quizzes.college_part_3_q3_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_3_q4', optionKeys: ['Quizzes.college_part_3_q4_opt1', 'Quizzes.college_part_3_q4_opt2', 'Quizzes.college_part_3_q4_opt3', 'Quizzes.college_part_3_q4_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_3_q5', optionKeys: ['Quizzes.college_part_3_q5_opt1', 'Quizzes.college_part_3_q5_opt2', 'Quizzes.college_part_3_q5_opt3', 'Quizzes.college_part_3_q5_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_3_q6', optionKeys: ['Quizzes.college_part_3_q6_opt1', 'Quizzes.college_part_3_q6_opt2', 'Quizzes.college_part_3_q6_opt3', 'Quizzes.college_part_3_q6_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_3_q7', optionKeys: ['Quizzes.college_part_3_q7_opt1', 'Quizzes.college_part_3_q7_opt2', 'Quizzes.college_part_3_q7_opt3', 'Quizzes.college_part_3_q7_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_3_q8', optionKeys: ['Quizzes.college_part_3_q8_opt1', 'Quizzes.college_part_3_q8_opt2', 'Quizzes.college_part_3_q8_opt3', 'Quizzes.college_part_3_q8_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_3_q9', optionKeys: ['Quizzes.college_part_3_q9_opt1', 'Quizzes.college_part_3_q9_opt2', 'Quizzes.college_part_3_q9_opt3', 'Quizzes.college_part_3_q9_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.college_part_3_q10', optionKeys: ['Quizzes.college_part_3_q10_opt1', 'Quizzes.college_part_3_q10_opt2', 'Quizzes.college_part_3_q10_opt3', 'Quizzes.college_part_3_q10_opt4'], answer: 0 }
                ]
            },
            {
                id: 'college_part_5',
                title: 'Networking Essentials',
                cost: 600,
                duration: 40,
                quizzes: [
                    { questionKey: 'Quizzes.college_part_4_q1', optionKeys: ['Quizzes.college_part_4_q1_opt1', 'Quizzes.college_part_4_q1_opt2', 'Quizzes.college_part_4_q1_opt3', 'Quizzes.college_part_4_q1_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.college_part_4_q2', optionKeys: ['Quizzes.college_part_4_q2_opt1', 'Quizzes.college_part_4_q2_opt2', 'Quizzes.college_part_4_q2_opt3', 'Quizzes.college_part_4_q2_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_4_q3', optionKeys: ['Quizzes.college_part_4_q3_opt1', 'Quizzes.college_part_4_q3_opt2', 'Quizzes.college_part_4_q3_opt3', 'Quizzes.college_part_4_q3_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.college_part_4_q4', optionKeys: ['Quizzes.college_part_4_q4_opt1', 'Quizzes.college_part_4_q4_opt2', 'Quizzes.college_part_4_q4_opt3', 'Quizzes.college_part_4_q4_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_4_q5', optionKeys: ['Quizzes.college_part_4_q5_opt1', 'Quizzes.college_part_4_q5_opt2', 'Quizzes.college_part_4_q5_opt3', 'Quizzes.college_part_4_q5_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_4_q6', optionKeys: ['Quizzes.college_part_4_q6_opt1', 'Quizzes.college_part_4_q6_opt2', 'Quizzes.college_part_4_q6_opt3', 'Quizzes.college_part_4_q6_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.college_part_4_q7', optionKeys: ['Quizzes.college_part_4_q7_opt1', 'Quizzes.college_part_4_q7_opt2', 'Quizzes.college_part_4_q7_opt3', 'Quizzes.college_part_4_q7_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_4_q8', optionKeys: ['Quizzes.college_part_4_q8_opt1', 'Quizzes.college_part_4_q8_opt2', 'Quizzes.college_part_4_q8_opt3', 'Quizzes.college_part_4_q8_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_4_q9', optionKeys: ['Quizzes.college_part_4_q9_opt1', 'Quizzes.college_part_4_q9_opt2', 'Quizzes.college_part_4_q9_opt3', 'Quizzes.college_part_4_q9_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_4_q10', optionKeys: ['Quizzes.college_part_4_q10_opt1', 'Quizzes.college_part_4_q10_opt2', 'Quizzes.college_part_4_q10_opt3', 'Quizzes.college_part_4_q10_opt4'], answer: 0 }
                ]
            },
            {
                id: 'college_part_6',
                title: 'Operating Systems',
                cost: 700,
                duration: 45,
                quizzes: [
                    { questionKey: 'Quizzes.college_part_5_q1', optionKeys: ['Quizzes.college_part_5_q1_opt1', 'Quizzes.college_part_5_q1_opt2', 'Quizzes.college_part_5_q1_opt3', 'Quizzes.college_part_5_q1_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.college_part_5_q2', optionKeys: ['Quizzes.college_part_5_q2_opt1', 'Quizzes.college_part_5_q2_opt2', 'Quizzes.college_part_5_q2_opt3', 'Quizzes.college_part_5_q2_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_5_q3', optionKeys: ['Quizzes.college_part_5_q3_opt1', 'Quizzes.college_part_5_q3_opt2', 'Quizzes.college_part_5_q3_opt3', 'Quizzes.college_part_5_q3_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_5_q4', optionKeys: ['Quizzes.college_part_5_q4_opt1', 'Quizzes.college_part_5_q4_opt2', 'Quizzes.college_part_5_q4_opt3', 'Quizzes.college_part_5_q4_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_5_q5', optionKeys: ['Quizzes.college_part_5_q5_opt1', 'Quizzes.college_part_5_q5_opt2', 'Quizzes.college_part_5_q5_opt3', 'Quizzes.college_part_5_q5_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_5_q6', optionKeys: ['Quizzes.college_part_5_q6_opt1', 'Quizzes.college_part_5_q6_opt2', 'Quizzes.college_part_5_q6_opt3', 'Quizzes.college_part_5_q6_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_5_q7', optionKeys: ['Quizzes.college_part_5_q7_opt1', 'Quizzes.college_part_5_q7_opt2', 'Quizzes.college_part_5_q7_opt3', 'Quizzes.college_part_5_q7_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_5_q8', optionKeys: ['Quizzes.college_part_5_q8_opt1', 'Quizzes.college_part_5_q8_opt2', 'Quizzes.college_part_5_q8_opt3', 'Quizzes.college_part_5_q8_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_5_q9', optionKeys: ['Quizzes.college_part_5_q9_opt1', 'Quizzes.college_part_5_q9_opt2', 'Quizzes.college_part_5_q9_opt3', 'Quizzes.college_part_5_q9_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_5_q10', optionKeys: ['Quizzes.college_part_5_q10_opt1', 'Quizzes.college_part_5_q10_opt2', 'Quizzes.college_part_5_q10_opt3', 'Quizzes.college_part_5_q10_opt4'], answer: 1 }
                ]
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
                quizzes: [
                    { questionKey: 'Quizzes.college_part_6_q1', optionKeys: ['Quizzes.college_part_6_q1_opt1', 'Quizzes.college_part_6_q1_opt2', 'Quizzes.college_part_6_q1_opt3', 'Quizzes.college_part_6_q1_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_6_q2', optionKeys: ['Quizzes.college_part_6_q2_opt1', 'Quizzes.college_part_6_q2_opt2', 'Quizzes.college_part_6_q2_opt3', 'Quizzes.college_part_6_q2_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_6_q3', optionKeys: ['Quizzes.college_part_6_q3_opt1', 'Quizzes.college_part_6_q3_opt2', 'Quizzes.college_part_6_q3_opt3', 'Quizzes.college_part_6_q3_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_6_q4', optionKeys: ['Quizzes.college_part_6_q4_opt1', 'Quizzes.college_part_6_q4_opt2', 'Quizzes.college_part_6_q4_opt3', 'Quizzes.college_part_6_q4_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_6_q5', optionKeys: ['Quizzes.college_part_6_q5_opt1', 'Quizzes.college_part_6_q5_opt2', 'Quizzes.college_part_6_q5_opt3', 'Quizzes.college_part_6_q5_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_6_q6', optionKeys: ['Quizzes.college_part_6_q6_opt1', 'Quizzes.college_part_6_q6_opt2', 'Quizzes.college_part_6_q6_opt3', 'Quizzes.college_part_6_q6_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_6_q7', optionKeys: ['Quizzes.college_part_6_q7_opt1', 'Quizzes.college_part_6_q7_opt2', 'Quizzes.college_part_6_q7_opt3', 'Quizzes.college_part_6_q7_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_6_q8', optionKeys: ['Quizzes.college_part_6_q8_opt1', 'Quizzes.college_part_6_q8_opt2', 'Quizzes.college_part_6_q8_opt3', 'Quizzes.college_part_6_q8_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.college_part_6_q9', optionKeys: ['Quizzes.college_part_6_q9_opt1', 'Quizzes.college_part_6_q9_opt2', 'Quizzes.college_part_6_q9_opt3', 'Quizzes.college_part_6_q9_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.college_part_6_q10', optionKeys: ['Quizzes.college_part_6_q10_opt1', 'Quizzes.college_part_6_q10_opt2', 'Quizzes.college_part_6_q10_opt3', 'Quizzes.college_part_6_q10_opt4'], answer: 1 }
                ]
            },
            {
                id: 'uni_part_2',
                title: 'Advanced Data Structures',
                cost: 1000,
                duration: 50,
                quizzes: [
                    { questionKey: 'Quizzes.uni_part_1_q1', optionKeys: ['Quizzes.uni_part_1_q1_opt1', 'Quizzes.uni_part_1_q1_opt2', 'Quizzes.uni_part_1_q1_opt3', 'Quizzes.uni_part_1_q1_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.uni_part_1_q2', optionKeys: ['Quizzes.uni_part_1_q2_opt1', 'Quizzes.uni_part_1_q2_opt2', 'Quizzes.uni_part_1_q2_opt3', 'Quizzes.uni_part_1_q2_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_1_q3', optionKeys: ['Quizzes.uni_part_1_q3_opt1', 'Quizzes.uni_part_1_q3_opt2', 'Quizzes.uni_part_1_q3_opt3', 'Quizzes.uni_part_1_q3_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_1_q4', optionKeys: ['Quizzes.uni_part_1_q4_opt1', 'Quizzes.uni_part_1_q4_opt2', 'Quizzes.uni_part_1_q4_opt3', 'Quizzes.uni_part_1_q4_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_1_q5', optionKeys: ['Quizzes.uni_part_1_q5_opt1', 'Quizzes.uni_part_1_q5_opt2', 'Quizzes.uni_part_1_q5_opt3', 'Quizzes.uni_part_1_q5_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_1_q6', optionKeys: ['Quizzes.uni_part_1_q6_opt1', 'Quizzes.uni_part_1_q6_opt2', 'Quizzes.uni_part_1_q6_opt3', 'Quizzes.uni_part_1_q6_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_1_q7', optionKeys: ['Quizzes.uni_part_1_q7_opt1', 'Quizzes.uni_part_1_q7_opt2', 'Quizzes.uni_part_1_q7_opt3', 'Quizzes.uni_part_1_q7_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_1_q8', optionKeys: ['Quizzes.uni_part_1_q8_opt1', 'Quizzes.uni_part_1_q8_opt2', 'Quizzes.uni_part_1_q8_opt3', 'Quizzes.uni_part_1_q8_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_1_q9', optionKeys: ['Quizzes.uni_part_1_q9_opt1', 'Quizzes.uni_part_1_q9_opt2', 'Quizzes.uni_part_1_q9_opt3', 'Quizzes.uni_part_1_q9_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_1_q10', optionKeys: ['Quizzes.uni_part_1_q10_opt1', 'Quizzes.uni_part_1_q10_opt2', 'Quizzes.uni_part_1_q10_opt3', 'Quizzes.uni_part_1_q10_opt4'], answer: 2 }
                ]
            },
            {
                id: 'uni_part_3',
                title: 'Artificial Intelligence',
                cost: 1200,
                duration: 60,
                quizzes: [
                    { questionKey: 'Quizzes.uni_part_2_q1', optionKeys: ['Quizzes.uni_part_2_q1_opt1', 'Quizzes.uni_part_2_q1_opt2', 'Quizzes.uni_part_2_q1_opt3', 'Quizzes.uni_part_2_q1_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.uni_part_2_q2', optionKeys: ['Quizzes.uni_part_2_q2_opt1', 'Quizzes.uni_part_2_q2_opt2', 'Quizzes.uni_part_2_q2_opt3', 'Quizzes.uni_part_2_q2_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_2_q3', optionKeys: ['Quizzes.uni_part_2_q3_opt1', 'Quizzes.uni_part_2_q3_opt2', 'Quizzes.uni_part_2_q3_opt3', 'Quizzes.uni_part_2_q3_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_2_q4', optionKeys: ['Quizzes.uni_part_2_q4_opt1', 'Quizzes.uni_part_2_q4_opt2', 'Quizzes.uni_part_2_q4_opt3', 'Quizzes.uni_part_2_q4_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_2_q5', optionKeys: ['Quizzes.uni_part_2_q5_opt1', 'Quizzes.uni_part_2_q5_opt2', 'Quizzes.uni_part_2_q5_opt3', 'Quizzes.uni_part_2_q5_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_2_q6', optionKeys: ['Quizzes.uni_part_2_q6_opt1', 'Quizzes.uni_part_2_q6_opt2', 'Quizzes.uni_part_2_q6_opt3', 'Quizzes.uni_part_2_q6_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_2_q7', optionKeys: ['Quizzes.uni_part_2_q7_opt1', 'Quizzes.uni_part_2_q7_opt2', 'Quizzes.uni_part_2_q7_opt3', 'Quizzes.uni_part_2_q7_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_2_q8', optionKeys: ['Quizzes.uni_part_2_q8_opt1', 'Quizzes.uni_part_2_q8_opt2', 'Quizzes.uni_part_2_q8_opt3', 'Quizzes.uni_part_2_q8_opt4', 'Quizzes.uni_part_2_q8_opt5'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_2_q9', optionKeys: ['Quizzes.uni_part_2_q9_opt1', 'Quizzes.uni_part_2_q9_opt2', 'Quizzes.uni_part_2_q9_opt3', 'Quizzes.uni_part_2_q9_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_2_q10', optionKeys: ['Quizzes.uni_part_2_q10_opt1', 'Quizzes.uni_part_2_q10_opt2', 'Quizzes.uni_part_2_q10_opt3', 'Quizzes.uni_part_2_q10_opt4'], answer: 1 }
                ]
            },
            {
                id: 'uni_part_4',
                title: 'Compiler Design',
                cost: 1500,
                duration: 70,
                quizzes: [
                    { questionKey: 'Quizzes.uni_part_3_q1', optionKeys: ['Quizzes.uni_part_3_q1_opt1', 'Quizzes.uni_part_3_q1_opt2', 'Quizzes.uni_part_3_q1_opt3', 'Quizzes.uni_part_3_q1_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_3_q2', optionKeys: ['Quizzes.uni_part_3_q2_opt1', 'Quizzes.uni_part_3_q2_opt2', 'Quizzes.uni_part_3_q2_opt3', 'Quizzes.uni_part_3_q2_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_3_q3', optionKeys: ['Quizzes.uni_part_3_q3_opt1', 'Quizzes.uni_part_3_q3_opt2', 'Quizzes.uni_part_3_q3_opt3', 'Quizzes.uni_part_3_q3_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_3_q4', optionKeys: ['Quizzes.uni_part_3_q4_opt1', 'Quizzes.uni_part_3_q4_opt2', 'Quizzes.uni_part_3_q4_opt3', 'Quizzes.uni_part_3_q4_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_3_q5', optionKeys: ['Quizzes.uni_part_3_q5_opt1', 'Quizzes.uni_part_3_q5_opt2', 'Quizzes.uni_part_3_q5_opt3', 'Quizzes.uni_part_3_q5_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_3_q6', optionKeys: ['Quizzes.uni_part_3_q6_opt1', 'Quizzes.uni_part_3_q6_opt2', 'Quizzes.uni_part_3_q6_opt3', 'Quizzes.uni_part_3_q6_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_3_q7', optionKeys: ['Quizzes.uni_part_3_q7_opt1', 'Quizzes.uni_part_3_q7_opt2', 'Quizzes.uni_part_3_q7_opt3', 'Quizzes.uni_part_3_q7_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_3_q8', optionKeys: ['Quizzes.uni_part_3_q8_opt1', 'Quizzes.uni_part_3_q8_opt2', 'Quizzes.uni_part_3_q8_opt3', 'Quizzes.uni_part_3_q8_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_3_q9', optionKeys: ['Quizzes.uni_part_3_q9_opt1', 'Quizzes.uni_part_3_q9_opt2', 'Quizzes.uni_part_3_q9_opt3', 'Quizzes.uni_part_3_q9_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_3_q10', optionKeys: ['Quizzes.uni_part_3_q10_opt1', 'Quizzes.uni_part_3_q10_opt2', 'Quizzes.uni_part_3_q10_opt3', 'Quizzes.uni_part_3_q10_opt4'], answer: 0 }
                ]
            },
            {
                id: 'uni_part_5',
                title: 'Distributed Systems',
                cost: 1800,
                duration: 80,
                quizzes: [
                    { questionKey: 'Quizzes.uni_part_4_q1', optionKeys: ['Quizzes.uni_part_4_q1_opt1', 'Quizzes.uni_part_4_q1_opt2', 'Quizzes.uni_part_4_q1_opt3', 'Quizzes.uni_part_4_q1_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.uni_part_4_q2', optionKeys: ['Quizzes.uni_part_4_q2_opt1', 'Quizzes.uni_part_4_q2_opt2', 'Quizzes.uni_part_4_q2_opt3', 'Quizzes.uni_part_4_q2_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_4_q3', optionKeys: ['Quizzes.uni_part_4_q3_opt1', 'Quizzes.uni_part_4_q3_opt2', 'Quizzes.uni_part_4_q3_opt3', 'Quizzes.uni_part_4_q3_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_4_q4', optionKeys: ['Quizzes.uni_part_4_q4_opt1', 'Quizzes.uni_part_4_q4_opt2', 'Quizzes.uni_part_4_q4_opt3', 'Quizzes.uni_part_4_q4_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_4_q5', optionKeys: ['Quizzes.uni_part_4_q5_opt1', 'Quizzes.uni_part_4_q5_opt2', 'Quizzes.uni_part_4_q5_opt3', 'Quizzes.uni_part_4_q5_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_4_q6', optionKeys: ['Quizzes.uni_part_4_q6_opt1', 'Quizzes.uni_part_4_q6_opt2', 'Quizzes.uni_part_4_q6_opt3', 'Quizzes.uni_part_4_q6_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_4_q7', optionKeys: ['Quizzes.uni_part_4_q7_opt1', 'Quizzes.uni_part_4_q7_opt2', 'Quizzes.uni_part_4_q7_opt3', 'Quizzes.uni_part_4_q7_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_4_q8', optionKeys: ['Quizzes.uni_part_4_q8_opt1', 'Quizzes.uni_part_4_q8_opt2', 'Quizzes.uni_part_4_q8_opt3', 'Quizzes.uni_part_4_q8_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_4_q9', optionKeys: ['Quizzes.uni_part_4_q9_opt1', 'Quizzes.uni_part_4_q9_opt2', 'Quizzes.uni_part_4_q9_opt3', 'Quizzes.uni_part_4_q9_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_4_q10', optionKeys: ['Quizzes.uni_part_4_q10_opt1', 'Quizzes.uni_part_4_q10_opt2', 'Quizzes.uni_part_4_q10_opt3', 'Quizzes.uni_part_4_q10_opt4'], answer: 1 }
                ]
            },
            {
                id: 'uni_part_6',
                title: 'Cybersecurity',
                cost: 2100,
                duration: 90,
                quizzes: [
                    { questionKey: 'Quizzes.uni_part_5_q1', optionKeys: ['Quizzes.uni_part_5_q1_opt1', 'Quizzes.uni_part_5_q1_opt2', 'Quizzes.uni_part_5_q1_opt3', 'Quizzes.uni_part_5_q1_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.uni_part_5_q2', optionKeys: ['Quizzes.uni_part_5_q2_opt1', 'Quizzes.uni_part_5_q2_opt2', 'Quizzes.uni_part_5_q2_opt3', 'Quizzes.uni_part_5_q2_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_5_q3', optionKeys: ['Quizzes.uni_part_5_q3_opt1', 'Quizzes.uni_part_5_q3_opt2', 'Quizzes.uni_part_5_q3_opt3', 'Quizzes.uni_part_5_q3_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_5_q4', optionKeys: ['Quizzes.uni_part_5_q4_opt1', 'Quizzes.uni_part_5_q4_opt2', 'Quizzes.uni_part_5_q4_opt3', 'Quizzes.uni_part_5_q4_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_5_q5', optionKeys: ['Quizzes.uni_part_5_q5_opt1', 'Quizzes.uni_part_5_q5_opt2', 'Quizzes.uni_part_5_q5_opt3', 'Quizzes.uni_part_5_q5_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_5_q6', optionKeys: ['Quizzes.uni_part_5_q6_opt1', 'Quizzes.uni_part_5_q6_opt2', 'Quizzes.uni_part_5_q6_opt3', 'Quizzes.uni_part_5_q6_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_5_q7', optionKeys: ['Quizzes.uni_part_5_q7_opt1', 'Quizzes.uni_part_5_q7_opt2', 'Quizzes.uni_part_5_q7_opt3', 'Quizzes.uni_part_5_q7_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_5_q8', optionKeys: ['Quizzes.uni_part_5_q8_opt1', 'Quizzes.uni_part_5_q8_opt2', 'Quizzes.uni_part_5_q8_opt3', 'Quizzes.uni_part_5_q8_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_5_q9', optionKeys: ['Quizzes.uni_part_5_q9_opt1', 'Quizzes.uni_part_5_q9_opt2', 'Quizzes.uni_part_5_q9_opt3', 'Quizzes.uni_part_5_q9_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_5_q10', optionKeys: ['Quizzes.uni_part_5_q10_opt1', 'Quizzes.uni_part_5_q10_opt2', 'Quizzes.uni_part_5_q10_opt3', 'Quizzes.uni_part_5_q10_opt4'], answer: 1 }
                ]
            },
            {
                id: 'uni_part_7',
                title: 'Cloud Computing',
                cost: 2500,
                duration: 100,
                quizzes: [
                    { questionKey: 'Quizzes.uni_part_6_q1', optionKeys: ['Quizzes.uni_part_6_q1_opt1', 'Quizzes.uni_part_6_q1_opt2', 'Quizzes.uni_part_6_q1_opt3', 'Quizzes.uni_part_6_q1_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_6_q2', optionKeys: ['Quizzes.uni_part_6_q2_opt1', 'Quizzes.uni_part_6_q2_opt2', 'Quizzes.uni_part_6_q2_opt3', 'Quizzes.uni_part_6_q2_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_6_q3', optionKeys: ['Quizzes.uni_part_6_q3_opt1', 'Quizzes.uni_part_6_q3_opt2', 'Quizzes.uni_part_6_q3_opt3', 'Quizzes.uni_part_6_q3_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_6_q4', optionKeys: ['Quizzes.uni_part_6_q4_opt1', 'Quizzes.uni_part_6_q4_opt2', 'Quizzes.uni_part_6_q4_opt3', 'Quizzes.uni_part_6_q4_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_6_q5', optionKeys: ['Quizzes.uni_part_6_q5_opt1', 'Quizzes.uni_part_6_q5_opt2', 'Quizzes.uni_part_6_q5_opt3', 'Quizzes.uni_part_6_q5_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_6_q6', optionKeys: ['Quizzes.uni_part_6_q6_opt1', 'Quizzes.uni_part_6_q6_opt2', 'Quizzes.uni_part_6_q6_opt3', 'Quizzes.uni_part_6_q6_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_6_q7', optionKeys: ['Quizzes.uni_part_6_q7_opt1', 'Quizzes.uni_part_6_q7_opt2', 'Quizzes.uni_part_6_q7_opt3', 'Quizzes.uni_part_6_q7_opt4'], answer: 2 },
                    { questionKey: 'Quizzes.uni_part_6_q8', optionKeys: ['Quizzes.uni_part_6_q8_opt1', 'Quizzes.uni_part_6_q8_opt2', 'Quizzes.uni_part_6_q8_opt3', 'Quizzes.uni_part_6_q8_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_6_q9', optionKeys: ['Quizzes.uni_part_6_q9_opt1', 'Quizzes.uni_part_6_q9_opt2', 'Quizzes.uni_part_6_q9_opt3', 'Quizzes.uni_part_6_q9_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_6_q10', optionKeys: ['Quizzes.uni_part_6_q10_opt1', 'Quizzes.uni_part_6_q10_opt2', 'Quizzes.uni_part_6_q10_opt3', 'Quizzes.uni_part_6_q10_opt4'], answer: 1 }
                ]
            },
            {
                id: 'uni_part_8',
                title: 'Master Thesis',
                cost: 3000,
                duration: 120,
                quizzes: [
                    { questionKey: 'Quizzes.uni_part_7_q1', optionKeys: ['Quizzes.uni_part_7_q1_opt1', 'Quizzes.uni_part_7_q1_opt2', 'Quizzes.uni_part_7_q1_opt3', 'Quizzes.uni_part_7_q1_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_7_q2', optionKeys: ['Quizzes.uni_part_7_q2_opt1', 'Quizzes.uni_part_7_q2_opt2', 'Quizzes.uni_part_7_q2_opt3', 'Quizzes.uni_part_7_q2_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_7_q3', optionKeys: ['Quizzes.uni_part_7_q3_opt1', 'Quizzes.uni_part_7_q3_opt2', 'Quizzes.uni_part_7_q3_opt3', 'Quizzes.uni_part_7_q3_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_7_q4', optionKeys: ['Quizzes.uni_part_7_q4_opt1', 'Quizzes.uni_part_7_q4_opt2', 'Quizzes.uni_part_7_q4_opt3', 'Quizzes.uni_part_7_q4_opt4'], answer: 0 },
                    { questionKey: 'Quizzes.uni_part_7_q5', optionKeys: ['Quizzes.uni_part_7_q5_opt1', 'Quizzes.uni_part_7_q5_opt2', 'Quizzes.uni_part_7_q5_opt3', 'Quizzes.uni_part_7_q5_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_7_q6', optionKeys: ['Quizzes.uni_part_7_q6_opt1', 'Quizzes.uni_part_7_q6_opt2', 'Quizzes.uni_part_7_q6_opt3', 'Quizzes.uni_part_7_q6_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_7_q7', optionKeys: ['Quizzes.uni_part_7_q7_opt1', 'Quizzes.uni_part_7_q7_opt2', 'Quizzes.uni_part_7_q7_opt3', 'Quizzes.uni_part_7_q7_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_7_q8', optionKeys: ['Quizzes.uni_part_7_q8_opt1', 'Quizzes.uni_part_7_q8_opt2', 'Quizzes.uni_part_7_q8_opt3', 'Quizzes.uni_part_7_q8_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_7_q9', optionKeys: ['Quizzes.uni_part_7_q9_opt1', 'Quizzes.uni_part_7_q9_opt2', 'Quizzes.uni_part_7_q9_opt3', 'Quizzes.uni_part_7_q9_opt4'], answer: 1 },
                    { questionKey: 'Quizzes.uni_part_7_q10', optionKeys: ['Quizzes.uni_part_7_q10_opt1', 'Quizzes.uni_part_7_q10_opt2', 'Quizzes.uni_part_7_q10_opt3', 'Quizzes.uni_part_7_q10_opt4'], answer: 1 }
                ]
            }
        ]
    }
];
