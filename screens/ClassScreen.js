// screens/ClassScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const lectures = [
    { id: '101', name: 'Introduction to Biology' },
    { id: '102', name: 'Genetics' },
    { id: '103', name: 'Evolution' },
];

export default function ClassScreen({ route, navigation }) {
    const { className } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{className} - Lectures</Text>
            <FlatList
                data={lectures}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.lectureItem}
                        onPress={() => navigation.navigate('Lecture', { lectureId: item.id, lectureName: item.name })}
                    >
                        <Text style={styles.lectureText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
    lectureItem: {
        padding: 20,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderRadius: 8,
    },
    lectureText: { fontSize: 18, color: '#333' },
});
