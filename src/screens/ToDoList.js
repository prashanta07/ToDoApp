import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ToDoList() {
  const [toDoList, setToDoList] = useState([]);
  const [typeText, setTypedText] = useState('');

  const [edit, setEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(false);

  useEffect(() => {
    const getAsyncData = async () => {
      try {
        const value = await AsyncStorage.getItem('data');
        if (value !== null) {
          setToDoList(JSON.parse(value));
        }
      } catch (e) {
        console.log(e);
      }
    };
    getAsyncData();
  }, []);

  const handlePressButton = async () => {
    if (typeText) {
      if (!edit) {
        setToDoList(prevState => {
          AsyncStorage.setItem(
            'data',
            JSON.stringify([...prevState, {text: typeText, complete: false}]),
          );
          return [...prevState, {text: typeText, complete: false}];
        });
        setTypedText('');
      } else {
        let tempData = toDoList;
        tempData[editIndex].text = typeText;
        setToDoList([...tempData]);
        setTypedText('');
        setEdit(false);
        AsyncStorage.setItem('data', JSON.stringify([...tempData]));
      }
    }
  };

  const markAsComplete = (value, index) => {
    let tempData = toDoList;
    tempData[index].complete = value;

    setToDoList([...tempData]);
    AsyncStorage.setItem('data', JSON.stringify([...tempData]));
  };

  const renderItem = ({item, index}) => (
    <View style={styles.renderItemContainer}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <CheckBox
          disabled={false}
          value={item.complete}
          onValueChange={value => markAsComplete(value, index)}
          boxType="square"
          style={{height: 20, width: 20}}
          onCheckColor={'#1a6985'}
          onTintColor={'#1a6985'}
        />

        <Text style={{paddingLeft: 10, width: 280}}>{item.text}</Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            let data = toDoList.filter((item, ind) => ind !== index);
            setToDoList(data);
            AsyncStorage.setItem('data', JSON.stringify(data));
          }}>
          <Icon name="delete-outline" size={25} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginTop: 5}}
          onPress={() => {
            setTypedText(item.text);
            setEdit(true);
            setEditIndex(index);
          }}>
          <Icon name="lead-pencil" size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComponent = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 300,
        }}>
        <Text style={{color: '#bdbbbb'}}>No data found </Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.todo}>To Do List</Text>
      </View>

      <View
        style={{
          flex: 1,
          paddingHorizontal: 10,
          marginTop: 10,
        }}>
        <FlatList
          data={toDoList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
          ListEmptyComponent={renderEmptyComponent}
        />

        <View style={styles.subContainer}>
          <TextInput
            value={typeText}
            style={styles.textInput}
            placeholder={'Type your task here ...'}
            onChangeText={text => setTypedText(text)}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handlePressButton} style={styles.button}>
              <Text style={{color: 'white'}}>{edit ? 'Edit' : 'Add'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, paddingBottom: 10},
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {alignItems: 'center', backgroundColor: '#1a6985', padding: 10},
  renderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  textInput: {
    flex: 0.9,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    padding: 5,
  },
  todo: {color: 'white', fontSize: 18, fontWeight: 'bold'},
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1a6985',
    padding: 10,
    borderRadius: 5,
  },
});
