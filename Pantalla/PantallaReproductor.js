import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function PantallaReproductor() {
  const [reproduciendo, establecerReproduciendo] = useState(false);
  const [cargando, establecerCargando] = useState(false);
  const referenciaAudio = useRef(null);

  useEffect(() => {
    configurarAudio();
    return () => {
      if (referenciaAudio.current) {
        referenciaAudio.current.unloadAsync();
      }
    };
  }, []);

  const configurarAudio = async () => {
    await Audio.setAudioModeAsync({
      shouldDuckAndroid:          true,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground:    false,
      allowsRecordingIOS:         false,
      playsInSilentModeIOS:       false,
    });
  };

  const reproducirMusica = async () => {
    try {
      establecerCargando(true);
      if (referenciaAudio.current) {
        await referenciaAudio.current.unloadAsync();
        referenciaAudio.current = null;
      }
      const { sound: nuevoSonido } = await Audio.Sound.createAsync(
        require('../assets/audio/cancion.mp3')
      );
      referenciaAudio.current = nuevoSonido;
      await nuevoSonido.playAsync();
      establecerReproduciendo(true);
      establecerCargando(false);
    } catch (error) {
      establecerCargando(false);
      Alert.alert('Error', 'No se pudo cargar cancion.mp3');
    }
  };

  const pausarMusica = async () => {
    if (referenciaAudio.current) {
      await referenciaAudio.current.pauseAsync();
      establecerReproduciendo(false);
    }
  };

  const detenerMusica = async () => {
    if (referenciaAudio.current) {
      await referenciaAudio.current.stopAsync();
      establecerReproduciendo(false);
    }
  };

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Reproductor de Musica</Text>
      <Text style={estilos.nombreArchivo}>cancion.mp3</Text>
      <Text style={estilos.estado}>
        {cargando ? 'Cargando...' : reproduciendo ? 'Reproduciendo' : 'Pausado'}
      </Text>
      <View style={estilos.filaControles}>
        <TouchableOpacity
          style={[estilos.boton, estilos.botonPlay]}
          onPress={reproducirMusica}
          disabled={cargando || reproduciendo}
        >
          <Text style={estilos.textoBoton}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.boton, estilos.botonPausa]}
          onPress={pausarMusica}
          disabled={!reproduciendo}
        >
          <Text style={estilos.textoBoton}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.boton, estilos.botonStop]}
          onPress={detenerMusica}
          disabled={!reproduciendo}
        >
          <Text style={estilos.textoBoton}>Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor:    { flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', padding: 24 },
  titulo:        { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 8 },
  nombreArchivo: { fontSize: 14, color: '#666666', marginBottom: 24 },
  estado:        { fontSize: 16, color: '#333333', fontWeight: '600', marginBottom: 40 },
  filaControles: { flexDirection: 'row', gap: 16 },
  boton:         { borderRadius: 10, paddingVertical: 14, paddingHorizontal: 22, elevation: 2 },
  botonPlay:     { backgroundColor: '#2D2D2D' },
  botonPausa:    { backgroundColor: '#888888' },
  botonStop:     { backgroundColor: '#555555' },
  textoBoton:    { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});