import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function SummarizeForm({ navigation, setSummary, setQuestions }) {
    const [lectureText, setLectureText] = useState("");

    const handleSummarize = async () => {
        try {
            const response = await fetch("http://192.168.1.166:5000/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: lectureText })
            });
            const data = await response.json();
            setSummary(data.summary);

            const questionResponse = await fetch("http://192.168.1.166:5000/generate_questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: lectureText })
            });
            const questionData = await questionResponse.json();
            setQuestions(questionData.questions);

            navigation.navigate("Quiz");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Summarize Your Lecture</Text>
            <TextInput
                style={styles.textInput}
                placeholder="Enter lecture text here..."
                value={lectureText}
                onChangeText={setLectureText}
                multiline
            />
            <Button title="Summarize and Generate Quiz" onPress={handleSummarize} color="#ff6b6b" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, justifyContent: 'center' },
    header: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#333' },
    textInput: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 20 }
});
