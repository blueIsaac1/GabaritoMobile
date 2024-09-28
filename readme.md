# Sistema de Correção Automática de Provas

Este projeto consiste em um sistema de correção automática de provas, composto por um backend em Flask (Python) e um frontend em React Native. O sistema processa imagens de gabaritos de alunos, compara com um gabarito do professor e calcula as notas finais.

## Funcionalidades

- Processamento de imagens de gabaritos
- Comparação automática com o gabarito do professor
- Cálculo de notas para questões objetivas e dissertativas
- Inclusão de notas de trabalhos
- Geração de relatório em CSV com o desempenho dos alunos

## Requisitos

### Backend (Python)
- Flask
- OpenCV (cv2)
- NumPy
- Werkzeug

### Frontend (React Native)
- React Native
- Expo
- Axios

## Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/blueIsaac1/GabaritoMobile.git
   cd nome-do-repositorio
   ```

2. Instale as dependências do backend:
   ```
   pip install flask opencv-python-headless numpy werkzeug
   ```

3. Instale as dependências do frontend:
   ```
   cd frontend
   npm install
   ```

## Configuração

1. Certifique-se de que o gabarito do professor está localizado em `./professor_gabarito/gabarito.jpg`.
3. Ajuste o endereço IP do servidor no arquivo do frontend (`ImageProcessingScreen.js`) para corresponder ao IP da sua máquina.

## Uso

1. Inicie o servidor backend:
   ```
   python app.py
   ```

2. Inicie o aplicativo React Native:
   ```
   cd frontend
   expo start
   ```

3. Use o aplicativo móvel para:
   - Selecionar a imagem do gabarito do aluno
   - Preencher as informações necessárias (nome, número de questões, etc.)
   - Enviar os dados para processamento

4. O sistema processará a imagem, calculará a nota e retornará o resultado.

5. Um relatório CSV será gerado com o desempenho de todos os alunos processados.

## Estrutura do Projeto

- `app.py`: Servidor Flask com as rotas e lógica de processamento
- `frontend/`: Pasta contendo o projeto React Native
  - `ImageProcessingScreen.js`: Tela principal do aplicativo móvel
- `professor_gabarito/`: Pasta contendo o gabarito do professor
- `uploads/`: Pasta para armazenar as imagens dos gabaritos dos alunos
- `temp/`: Pasta temporária para processamento de imagens

## Contribuição

Contribuições são bem-vindas! Por favor, sinta-se à vontade para submeter pull requests ou abrir issues para discutir melhorias ou relatar problemas.

## Licença

[MIT License](https://opensource.org/licenses/MIT)
