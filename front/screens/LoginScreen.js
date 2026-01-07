// front/screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  const onLogin = async () => {
    const res = await signIn({ email, password });

    if (!res.ok) {
      setErr(res.message || "Error");
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      {err ? <Text style={styles.error}>{err}</Text> : null}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <Button title="Ingresar" onPress={onLogin} />
      <Button title="Crear cuenta" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 20, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginVertical: 10, padding: 10, borderRadius: 5 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' }
});
