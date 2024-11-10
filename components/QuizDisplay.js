import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function QuizDisplay({ navigation, summary, questions }) {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState({});
    const [score, setScore] = useState(null);

    // Handle answer selection directly by comparing with correct_answer
    const handleAnswerSelection = (questionIdx, choice) => {
        const isCorrect = choice === questions[questionIdx].correct_answer;
        
        setSelectedAnswers({ ...selectedAnswers, [questionIdx]: choice });
        setShowResults({ ...showResults, [questionIdx]: isCorrect ? 'correct' : 'incorrect' });
    };

    // Calculate score based on correct answers
    const calculateScore = () => {
        let correctCount = 0;
        questions.forEach((q, idx) => {
            if (showResults[idx] === 'correct') correctCount += 1;
        });
        setScore(correctCount);
        navigation.navigate("Results", { score: correctCount, total: questions.length });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Summary</Text>
            <Text style={styles.summary}>{summary}</Text>

            <Text style={styles.header}>Quiz</Text>
            {questions.map((question, index) => (
                <View key={index} style={styles.questionContainer}>
                    <Text style={styles.questionText}>{question.question}</Text>
                    {question.choices && question.choices.map((choice, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[
                                styles.choiceButton,
                                selectedAnswers[index] === choice &&
                                    (showResults[index] === 'correct'
                                        ? styles.correctChoiceButton
                                        : styles.incorrectChoiceButton),
                            ]}
                            onPress={() => handleAnswerSelection(index, choice)}
                            disabled={showResults[index] !== undefined} // Disable choices after selection
                        >
                            <Text style={styles.choiceText}>{choice}</Text>
                        </TouchableOpacity>
                    ))}
                    {/* Show the correct answer if the user selected incorrectly */}
                    {showResults[index] === 'incorrect' && (
                        <View style={styles.correctAnswerContainer}>
                            <Text style={styles.correctAnswerText}>
                                Correct Answer: {question.correct_answer}
                            </Text>
                        </View>
                    )}
                </View>
            ))}
            <TouchableOpacity style={styles.submitButton} onPress={calculateScore}>
                <Text style={styles.submitButtonText}>Submit Quiz</Text>
            </TouchableOpacity>
            {score !== null && (
                <Text style={styles.scoreText}>
                    Your Score: {score} / {questions.length}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1 },
    header: { fontSize: 24, marginBottom: 10, textAlign: 'center', color: '#333' },
    summary: { marginBottom: 20, color: '#666' },
    questionContainer: { marginBottom: 20 },
    questionText: { fontSize: 16, marginBottom: 10 },
    choiceButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 10,
    },
    correctChoiceButton: {
        backgroundColor: '#d4edda', // Light green for correct answer
        borderColor: '#28a745', // Green border
    },
    incorrectChoiceButton: {
        backgroundColor: '#f8d7da', // Light red for incorrect answer
        borderColor: '#dc3545', // Red border
    },
    choiceText: { color: '#333' },
    correctAnswerContainer: {
        backgroundColor: '#d4edda',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
    },
    correctAnswerText: {
        color: '#28a745',
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#ff6b6b',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scoreText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginTop: 20,
    },
});
