import React from 'react';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslations } from 'next-intl';
import styles from '../EducationWindow.module.css';
import { Quiz } from '../../../lib/game/constants/education';

interface QuizResult {
    type: 'success' | 'failure';
    onContinue: () => void;
}

interface QuizDisplayProps {
    quiz: Quiz;
    result: QuizResult | null;
    onAnswer: (index: number) => void;
}

const QuizDisplay: React.FC<QuizDisplayProps> = ({ quiz, result, onAnswer }) => {
    const t = useTranslations();

    return (
        <div className={styles.quizContainer}>
            {result ? (
                <div className={styles.resultContainer}>
                    <div className={`${styles.resultIcon} ${styles[result.type]}`}>
                        {result.type === 'success' ? '✓' : '✗'}
                    </div>
                    <div className={`${styles.resultTitle} ${styles[result.type]}`}>
                        {result.type === 'success' ? t('Education.exam_passed') : t('Education.exam_failed_title') || 'Failed!'}
                    </div>
                    <div className={styles.resultMessage}>
                        {result.type === 'success' ? t('Education.exam_passed') || 'Great job!' : t('Education.rejected')}
                    </div>
                    <button
                        className={`${styles.continueBtn} ${styles[result.type]}`}
                        onClick={result.onContinue}
                    >
                        {t('Common.continue')}
                    </button>
                </div>
            ) : (
                <>
                    <div className={styles.question}>
                        {t(quiz.questionKey)}
                    </div>
                    <div className={styles.options}>
                        {quiz.optionKeys.map((optionKey: string, idx: number) => (
                            <button
                                key={idx}
                                className={styles.optionBtn}
                                onClick={() => onAnswer(idx)}
                            >
                                {t(optionKey)}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default QuizDisplay;
