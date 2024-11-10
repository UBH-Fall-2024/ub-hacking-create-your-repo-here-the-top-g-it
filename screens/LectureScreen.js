// screens/LectureScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export default function LectureScreen({ route, navigation }) {
    const { lectureName } = route.params;
    const [lectureText, setLectureText] = useState("");
    const [summary, setSummary] = useState("");
    const [questions, setQuestions] = useState([]);
    const [showSummary, setShowSummary] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [uploadStatus, setUploadStatus] = useState("");

    const handleSummarize = async () => {
        try {
            const response = await fetch("http://192.168.1.166:5000/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: lectureText }),
            });
            const data = await response.json();
            setSummary(data.summary);
            setShowSummary(true);
            setShowQuiz(false);
        } catch (error) {
            console.error("Error generating summary:", error);
        }
    };

    const handleGenerateQuiz = async () => {
        try {
            const response = await fetch("http://192.168.1.166:5000/generate_questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: lectureText }),
            });
            const data = await response.json();
            setQuestions(data.questions);
            setShowQuiz(true);
            setShowSummary(false);
            setSelectedAnswers({});
        } catch (error) {
            console.error("Error generating quiz:", error);
        }
    };

    const handleUploadPdf = async () => {
        setUploadStatus("Uploading...");
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
                copyToCacheDirectory: true,
            });

            if (result.type === "success") {
                const fileUri = result.uri;
                const fileData = await FileSystem.readAsStringAsync(fileUri, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                const response = await fetch("http://192.168.1.166:5000/upload_pdf", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fileData, fileName: result.name }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setSummary(data.summary);
                    setShowSummary(true);
                    setUploadStatus("File uploaded and summarized successfully!");
                } else {
                    setUploadStatus(`Upload failed: ${response.statusText}`);
                    console.error("Upload failed with status:", response.status);
                }
            } else {
                setUploadStatus("File selection was canceled.");
            }
        } catch (error) {
            setUploadStatus("Error uploading PDF.");
            console.error("Error uploading PDF:", error);
        }
    };

    // Handle answer selection and determine correctness
    const handleAnswerSelection = (questionIdx, choice) => {
        const correctAnswer = questions[questionIdx].correct_answer;
        const isCorrect = choice === correctAnswer;
        
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIdx]: { choice, isCorrect }, // Store selected answer and correctness
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{lectureName}</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Enter lecture text here..."
                value={lectureText}
                onChangeText={setLectureText}
                multiline
            />
            <View style={styles.buttonContainer}>
                <Button title="Summarize Lecture" onPress={handleSummarize} color="#ff6b6b" />
                <Button title="Generate Quiz" onPress={handleGenerateQuiz} color="#6b8eff" />
                <Button title="Upload PDF" onPress={handleUploadPdf} color="#4CAF50" />
            </View>

            <Text>{uploadStatus}</Text>

            {showSummary && (
                <View style={styles.summaryContainer}>
                    <Text style={styles.sectionHeader}>Summary</Text>
                    <Text style={styles.summaryText}>{summary}</Text>
                </View>
            )}

            {showQuiz && (
                <View style={styles.quizContainer}>
                    <Text style={styles.sectionHeader}>Quiz</Text>
                    <FlatList
                        data={questions}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.questionContainer}>
                                <Text style={styles.questionText}>{item.question}</Text>
                                {item.choices.map((choice, idx) => {
                                    const selectedAnswer = selectedAnswers[index];
                                    const isSelected = selectedAnswer && selectedAnswer.choice === choice;
                                    const isCorrectSelection = isSelected && selectedAnswer.isCorrect;
                                    const isIncorrectSelection = isSelected && !selectedAnswer.isCorrect;

                                    return (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[
                                                styles.choiceButton,
                                                isCorrectSelection ? styles.correctChoiceButton : null,
                                                isIncorrectSelection ? styles.incorrectChoiceButton : null,
                                            ]}
                                            onPress={() => handleAnswerSelection(index, choice)}
                                        >
                                            <Text style={styles.choiceText}>{choice}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    textInput: { 
        borderWidth: 1, 
        borderColor: '#ddd', 
        padding: 10, 
        borderRadius: 8, 
        marginBottom: 20 
    },
    buttonContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 20 
    },
    summaryContainer: { 
        marginTop: 20 
    },
    sectionHeader: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    summaryText: { 
        fontSize: 16, 
        color: '#333' 
    },
    quizContainer: { 
        marginTop: 20 
    },
    questionContainer: { 
        marginBottom: 20 
    },
    questionText: { 
        fontSize: 16, 
        marginBottom: 10 
    },
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
    choiceText: { 
        color: '#333' 
    },
});
