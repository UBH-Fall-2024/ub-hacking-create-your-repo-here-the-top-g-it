// screens/HomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const classes = [
    { id: '1', name: 'Biology 101' },
    { id: '2', name: 'History 101' },
    { id: '3', name: 'Math 101' },
];

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Classes</Text>
            <FlatList
                data={classes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.classItem}
                        onPress={() => navigation.navigate('Class', { classId: item.id, className: item.name })}
                    >
                        <Text style={styles.classText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    header: { fontSize: 24, textAlign: 'center', marginBottom: 20 },
    classItem: {
        padding: 20,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderRadius: 8,
    },
    classText: { fontSize: 18, color: '#333' },
});
