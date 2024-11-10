import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ResultDisplay({ route, navigation }) {
    const { score, total } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Quiz Results</Text>
            <Text style={styles.score}>You scored {score} out of {total}</Text>
            <Button title="Go Back" onPress={() => navigation.navigate("Summarize")} color="#ff6b6b" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 24, marginBottom: 10, textAlign: 'center', color: '#333' },
    score: { fontSize: 20, color: '#4CAF50' }
});
