/*
stAuth936961,I Mashrur Alam, 000936961 certify that this material is my original work. No other person's work has been used without due acknowledgement.
 I have not made my work available to anyone else."

*/



import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

const SERVER_URL = 'http://localhost:3001'; 

export default function TodoApp() {
  const [todos, setTodos] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const res = await axios.get<string[]>(`${SERVER_URL}/load`);
      setTodos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const saveTodos = async () => {
    try {
      await axios.post(`${SERVER_URL}/save`, todos);
      alert('Save successful');
    } catch (err) {
      console.error(err);
    }
  };

  const clearTodos = async () => {
    try {
      await axios.get(`${SERVER_URL}/clear`);
      setTodos([]);
    } catch (err) {
      console.error(err);
    }
  };

  const addOrEditTodo = () => {
    const cleanedInput = input.trim();
  if (!cleanedInput || cleanedInput.replace(/["']/g, '').trim() === '') return;

    if (editIndex !== null) {
      const updated = [...todos];
      updated[editIndex] = input;
      setTodos(updated);
      setEditIndex(null);
    } else {
      setTodos([...todos, input]);
    }

    setInput('');
  };

  const deleteTodo = (index: number) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  };

  const startEdit = (index: number) => {
    setInput(todos[index]);
    setEditIndex(index);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>TODO List</Text>

      <View style={styles.buttonRow}>
        <Button title="Save" onPress={saveTodos} />
        <Button title="Restore" onPress={loadTodos} />
        <Button title="Clear" onPress={clearTodos} />
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter task..."
          value={input}
          onChangeText={setInput}
        />
        <Button title={editIndex !== null ? 'Edit' : 'Add'} onPress={addOrEditTodo} />
      </View>

      <FlatList
        data={todos}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.todoRow}>
            <Text style={styles.todoText}>{item}</Text>
            <View style={styles.iconGroup}>
              <TouchableOpacity onPress={() => startEdit(index)}>
                <Text style={styles.icon}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTodo(index)}>
                <Text style={styles.icon}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  inputRow: { flexDirection: 'row', marginBottom: 10 },
  input: { flex: 1, borderWidth: 1, padding: 8, marginRight: 8, borderRadius: 4 },
  todoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  todoText: { fontSize: 18 },
  iconGroup: { flexDirection: 'row' },
  icon: { fontSize: 18, marginLeft: 10 },
});
