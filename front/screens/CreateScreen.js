//front/CreateScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../AuthContext';
import { apiFetch } from '../apiHelper';

export default function CreateScreen({ navigation }) {
  const { userInfo, signOut } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [muscle, setMuscle] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const handleCreate = async () => {
    const { ok, status, data } = await apiFetch('/exercises', {
      method: 'POST',
      body: JSON.stringify({
        name,
        muscle,
        reps: Number(reps),
        weight: Number(weight)
      })
    });

    if (ok) navigation.navigate('Home');
    else console.error('create error', status, data);
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

      {/* 🔵 FORMULARIO */}
      <TextInput placeholder="Nombre" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Músculo" value={muscle} onChangeText={setMuscle} style={styles.input} />
      <TextInput placeholder="Reps" value={reps} onChangeText={setReps} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Peso" value={weight} onChangeText={setWeight} style={styles.input} keyboardType="numeric" />

      <Button title="Crear" onPress={handleCreate} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 10,
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

  input: {
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    borderRadius: 5
  }
});
