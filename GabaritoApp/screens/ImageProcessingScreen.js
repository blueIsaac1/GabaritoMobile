import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text,
  Animated,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const StudentForm = () => {
  const [alunoImage, setAlunoImage] = useState(null);
  const [nomeAluno, setNomeAluno] = useState('');
  const [numQuestoesObjetivas, setNumQuestoesObjetivas] = useState('');
  const [numQuestionsDissertativas, setNumQuestionsDissertativas] = useState('');
  const [numOptions, setNumOptions] = useState('');
  const [notaDissertativa, setNotaDissertativa] = useState('');
  const [notaTrabalho, setNotaTrabalho] = useState('');
  const [images] = useState([
    require('../assets/primeiraSlide.png'),
    require('../assets/segundaSlide.png'),
    require('../assets/terceiroSlide.png'),
  ]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImagePicker, setShowImagePicker] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setAlunoImage(result.assets[0].uri);
      setShowImagePicker(false);
    }
  };

  const handleSubmit = async () => {
    if (!alunoImage) {
      Alert.alert('Erro', 'Por favor, selecione a imagem do aluno.');
      return;
    }

    const formData = new FormData();
    formData.append('aluno_image', {
      uri: alunoImage,
      type: 'image/jpeg',
      name: 'aluno_image.jpg',
    });
    formData.append('nome_aluno', nomeAluno);
    formData.append('num_questions_objetivas', numQuestoesObjetivas);
    formData.append('num_questions_dissertativas', numQuestionsDissertativas);
    formData.append('num_options', numOptions);
    formData.append('nota_dissertativa', notaDissertativa);
    formData.append('nota_trabalho', notaTrabalho);

    try {
      const response = await axios.post('http://192.168.0.4:5000/process_student', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert('Sucesso', `Nota final: ${response.data.nota_final}`);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao processar os dados do aluno.');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: -currentImageIndex * 200, // Use 200 que é a largura da imagem
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentImageIndex]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollViewCont}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        keyboardShouldPersistTaps="handled"
      >
        {showImagePicker && (
          <View style={styles.carouselContainer}>
            <Animated.View style={[styles.imageWrapper, { transform: [{ translateX: slideAnim }] }]}>
              {images.map((image, index) => (
                <Image key={index} source={image} style={styles.carouselImage} />
              ))}
            </Animated.View>
          </View>
        )}

        {alunoImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: alunoImage }} style={styles.image} />
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>
            {alunoImage ? 'Trocar a imagem selecionada' : 'Selecionar Imagem do Aluno'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Nome do Aluno"
          value={nomeAluno}
          onChangeText={setNomeAluno}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de Questões Objetivas"
          value={numQuestoesObjetivas}
          onChangeText={setNumQuestoesObjetivas}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Número de Questões Dissertativas"
          value={numQuestionsDissertativas}
          onChangeText={setNumQuestionsDissertativas}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Número de Opções por Questão"
          value={numOptions}
          onChangeText={setNumOptions}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Nota Dissertativa"
          value={notaDissertativa}
          onChangeText={setNotaDissertativa}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Nota do Trabalho"
          value={notaTrabalho}
          onChangeText={setNotaTrabalho}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scrollViewCont: {
    flex: 1,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  carouselContainer: {
    width: 200,
    height: 200,
    overflow: 'hidden',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    paddingLeft:400,
    flexDirection: 'row',
  },
  carouselImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  imageContainer: {
    width: 200,
    height: 200,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#273A96',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 100,
    alignItems: 'center',
    marginVertical: 10,
    minWidth: '50%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentForm;
