/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, Text} from 'react-native';
import ToDoList from './src/screens/ToDoList';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ToDoList />
    </SafeAreaView>
  );
};

export default App;
