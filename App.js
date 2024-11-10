// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ClassScreen from './screens/ClassScreen';
import LectureScreen from './screens/LectureScreen';
import LoginScreen from './screens/LoginScreen';
import SummarizeForm from './components/SummarizeForm';
import QuizDisplay from './components/QuizDisplay';
import ResultDisplay from './components/ResultDisplay';

const Stack = createStackNavigator();

export default function App() {
    const [summary, setSummary] = useState("");
    const [questions, setQuestions] = useState([]);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {/* Login Screen */}
                <Stack.Screen name="Login" component={LoginScreen} />
                
                {/* Home Screen */}
                <Stack.Screen name="Home" component={HomeScreen} />
                
                {/* Class Screen */}
                <Stack.Screen name="Class" component={ClassScreen} />
                
                {/* Lecture Screen */}
                <Stack.Screen name="Lecture" component={LectureScreen} />

                {/* Summarize Form Screen */}
                <Stack.Screen name="Summarize">
                    {props => (
                        <SummarizeForm 
                            {...props} 
                            setSummary={setSummary} 
                            setQuestions={setQuestions} 
                        />
                    )}
                </Stack.Screen>

                {/* Quiz Display Screen */}
                <Stack.Screen name="Quiz">
                    {props => (
                        <QuizDisplay 
                            {...props} 
                            summary={summary} 
                            questions={questions} 
                        />
                    )}
                </Stack.Screen>

                {/* Results Screen */}
                <Stack.Screen name="Results" component={ResultDisplay} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
