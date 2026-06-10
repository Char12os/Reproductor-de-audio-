# Reproductor de Audio en Android
**Expo SDK 54 · React Native · expo-av**
 
Proyecto para reproducir un archivo MP3 local en Android con controles de Play, Pause y Stop.
 
---
 
## Requisitos
 
- Node.js instalado
- Expo Go instalado en el celular Android
- PC y celular en la misma red WiFi
---
 
## Pasos para configurar el proyecto
 
### 1. Crear el proyecto
 
```cmd
npx create-expo-app audio --template blank
cd audio
```
 
### 2. Instalar expo-av
 
```cmd
npm install expo-av
```
 
### 3. Instalar React Navigation
 
```cmd
npm install @react-navigation/native @react-navigation/native-stack --legacy-peer-deps
npx expo install react-native-screens react-native-safe-area-context
```
 
> **Nota:** Se requiere `--legacy-peer-deps` por un conflicto de versiones entre `react-native-screens` y `react-native@0.81.5`.
 
### 4. Agregar el archivo de música
 
Crear la carpeta y copiar el MP3:
 
```cmd
mkdir assets\audio
```
 
Copia tu archivo MP3 a `assets\audio\` y renómbralo exactamente `cancion.mp3`.
 
### 5. Crear la carpeta de pantallas
 
```cmd
mkdir Pantalla
```
 
Crear el archivo `Pantalla\PantallaReproductor.js` con el código del reproductor.
 
---
 
## Estructura del proyecto
 
```
audio/
├── assets/
│   └── audio/
│       └── cancion.mp3
├── Pantalla/
│   └── PantallaReproductor.js
├── App.js
└── package.json
```
 
---
 
## Código
 
### `Pantalla/PantallaReproductor.js`
 
```javascript
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
```
 
### `App.js`
 
> **Importante:** No usar React Navigation. Importar directamente el componente.
 
```javascript
import React from 'react';
import PantallaReproductor from './Pantalla/PantallaReproductor';
 
export default function Aplicacion() {
  return <PantallaReproductor />;
}
```
 
---
 
## Ejecutar el proyecto
 
```cmd
npx expo start --lan
```
 
Abre **Expo Go** en el celular y escanea el QR que aparece en la terminal.
 
---
 
## Solución de problemas
 
| Error | Solución |
|-------|----------|
| `Unable to resolve "expo-av"` | `npm install expo-av` y reiniciar con `--clear` |
| `Unable to resolve "@react-navigation/native"` | `npm install @react-navigation/native @react-navigation/native-stack --legacy-peer-deps` |
| `Got an invalid value for 'component' prop` | Quitar React Navigation del App.js e importar el componente directo |
| `Unable to resolve asset cancion.mp3` | Verificar que el archivo esté en `assets\audio\cancion.mp3` |
| Error 500 en Expo Go | `npx expo start --lan --clear` |
| Audio no se escucha | Verificar `playThroughEarpieceAndroid: false` en `configurarAudio()` |
