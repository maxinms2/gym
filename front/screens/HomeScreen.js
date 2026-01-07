//front/screens/HomeScreen.js
import React, { useState, useContext, useCallback } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { BASE_URL } from '../api';
import { AuthContext } from '../AuthContext';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [data, setData] = useState([]);
  const { userInfo, signOut } = useContext(AuthContext);

  const loadData = () => {
    fetch(`${BASE_URL}/exercises`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(console.error);
  };

  // 🟢 RECARGA AUTOMÁTICA SIEMPRE QUE SE ENTRA A HOME
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleDelete = (id) => {
    fetch(`${BASE_URL}/exercises/${id}`, { method: 'DELETE' })
      .then(() => loadData())
      .catch(console.error);
  };

  return (
    <View style={styles.container}>

      {/* 🔵 ENCABEZADO */}
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Bienvenido, {userInfo?.name || 'Usuario'}
        </Text>

        <TouchableOpacity onPress={signOut}>
          <Text style={styles.logout}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <Button title="Crear ejercicio" onPress={() => navigation.navigate('Create')} />

      <FlatList
        data={data}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>{item.name} - {item.reps} reps - {item.weight} kg</Text>

            <View style={styles.row}>
              <TouchableOpacity onPress={() => navigation.navigate('Edit', { exercise: item })}>
                <Text style={styles.edit}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleDelete(item._id)}>
                <Text style={styles.delete}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  logout: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold'
  },

  card: { padding: 15, borderWidth: 1, marginVertical: 10, borderRadius: 8 },
  text: { fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  edit: { color: 'blue' },
  delete: { color: 'red' }
});
