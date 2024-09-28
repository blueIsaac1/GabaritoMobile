from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import cv2
import numpy as np
import json
import csv


app = Flask(__name__)

UPLOAD_FOLDER = 'temp'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def process_image(image_path, num_questions=10, num_options=5):
    image = cv2.imread(image_path)
    if image is None:
        print(f"Erro ao carregar a imagem: {image_path}")
        return []
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    altura, largura = thresh.shape
    cell_height = altura // num_questions
    cell_width = largura // num_options
    answers = []
    for i in range(num_questions):
        question_answers = []
        for j in range(num_options):
            cell = thresh[i * cell_height:(i + 1) * cell_height, j * cell_width:(j + 1) * cell_width]
            total_white = cv2.countNonZero(cell)
            if total_white > (cell_height * cell_width) // 2:
                question_answers.append(chr(65 + j))
        if question_answers:
            answers.append(question_answers[0])
        else:
            answers.append("")
    return answers

def compare_with_answer_key(student_answers, answer_key):
    score = 0
    for i, correct_answer in enumerate(answer_key):
        if i < len(student_answers) and correct_answer == student_answers[i]:
            score += 1
    return score

# Função para processar um aluno e calcular sua nota
def process_student(gabarito_professor, aluno_image_path):
    nome_aluno = os.path.basename(aluno_image_path).split('.')[0]

    # Coleta de informações específicas para o aluno
    num_questions_objetivas = int(input(f"Quantas perguntas objetivas para o aluno {nome_aluno}? "))
    num_questions_dissertativas = int(input(f"Quantas perguntas dissertativas para o aluno {nome_aluno}? "))
    num_options = int(input(f"Quantas opções por pergunta objetiva para o aluno {nome_aluno}? "))

    nota_dissertativa = 0
    if num_questions_dissertativas > 0:
        nota_dissertativa = float(
            input(f"Nota das perguntas dissertativas para {nome_aluno} (máximo {num_questions_dissertativas * 10}): "))

    nota_trabalho = float(input(f"Nota de trabalho do aluno {nome_aluno} (máximo 10): "))

    # Processamento das respostas do aluno e do gabarito
    respostas_professor = process_image(gabarito_professor, num_questions_objetivas, num_options)
    if not respostas_professor:
        print("Erro ao processar o gabarito do professor!")
        return None

    respostas_aluno = process_image(aluno_image_path, num_questions_objetivas, num_options)
    if not respostas_aluno:
        print(f"Erro ao processar as respostas do aluno {nome_aluno}.")
        return None

    # Comparação com o gabarito e cálculo da pontuação
    pontuacao = compare_with_answer_key(respostas_aluno, respostas_professor)
    print(f"Aluno {nome_aluno}: {pontuacao}/{num_questions_objetivas}")

    # Cálculo da média final
    nota_final = calcular_media(pontuacao, num_questions_objetivas, nota_trabalho, nota_dissertativa,
                                num_questions_dissertativas)

    # Exibindo a média calculada
    print(f"Média final do aluno {nome_aluno}: {nota_final}")

    return nome_aluno, pontuacao, nota_trabalho, nota_final

# Função para calcular a média final
def calcular_media(pontuacao, num_questions_objetivas, nota_trabalho, nota_dissertativa, num_questions_dissertativas):
    # Calcula a média da prova objetiva
    media_objetiva = (pontuacao / num_questions_objetivas) * 10

    # Se houver perguntas dissertativas, calcula a média delas
    media_dissertativa = 0
    if num_questions_dissertativas > 0:
        media_dissertativa = (nota_dissertativa / (num_questions_dissertativas * 10)) * 10
        media_prova = (media_objetiva + media_dissertativa) / 2  # Média ponderada da prova
    else:
        media_prova = media_objetiva

    # Cálculo da média ponderada final: 70% da prova e 30% do trabalho
    nota_final = (media_prova * 0.7) + (nota_trabalho * 0.3)

    return round(nota_final, 2)  # Arredonda para 2 casas decimais

# Função para gerar o relatório em CSV
def generate_report(result, output_file):
    file_exists = os.path.isfile(output_file)
    with open(output_file, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(['Nome do Aluno', 'Pontuação da Prova', 'Nota do Trabalho', 'Nota Final'])
        if result:
            writer.writerow(result)

    print(f"Dados adicionados ao relatório: {output_file}")

@app.route('/process_student', methods=['POST'])
def api_process_student():
    if 'aluno_image' not in request.files:
        return jsonify({'error': 'Falta arquivo de imagem do aluno'}), 400

    aluno_image = request.files['aluno_image']
    
    # Salvar a imagem temporariamente
    aluno_path = os.path.join('temp', secure_filename(aluno_image.filename))
    aluno_image.save(aluno_path)

    # Obter as variáveis do formulário
    nome_aluno = request.form.get('nome_aluno')
    num_questions_objetivas = int(request.form.get('num_questions_objetivas'))
    num_questions_dissertativas = int(request.form.get('num_questions_dissertativas'))
    num_options = int(request.form.get('num_options'))
    nota_dissertativa = float(request.form.get('nota_dissertativa', 0))
    nota_trabalho = float(request.form.get('nota_trabalho'))

    # Processamento das respostas do aluno e do gabarito
    respostas_professor = process_image(gabarito_professor, num_questions_objetivas, num_options)
    if not respostas_professor:
        return jsonify({'error': 'Erro ao processar o gabarito do professor'}), 500

    respostas_aluno = process_image(aluno_path, num_questions_objetivas, num_options)
    if not respostas_aluno:
        return jsonify({'error': f'Erro ao processar as respostas do aluno {nome_aluno}'}), 500

    # Comparação com o gabarito e cálculo da pontuação
    pontuacao = compare_with_answer_key(respostas_aluno, respostas_professor)

    # Cálculo da média final
    nota_final = calcular_media(pontuacao, num_questions_objetivas, nota_trabalho, nota_dissertativa,
                                num_questions_dissertativas)

    # Remover a imagem temporária
    os.remove(aluno_path)
    result = [f"Nome do Aluno: {nome_aluno:<20} | Pontuação da Prova: {pontuacao:>2}/{num_questions_objetivas:<2} | Nota do Trabalho: {nota_trabalho:>5.2f} | Nota Final: {nota_final:>5.2f}"]
    generate_report(result, report_file)

    # Retornar os resultados
    return jsonify({
        'nome_aluno': nome_aluno,
        'pontuacao': pontuacao,
        'nota_trabalho': nota_trabalho,
        'nota_final': nota_final
    })

gabarito_professor = "./gabarito_flask/professor_gabarito/gabarito.jpg"
student_image_paths = ("./gabarito_flask/uploads/gabarito.jpg")
resultados_alunos = []

report_file = './gabarito_flask/relatorio_desempenho.csv'
generate_report(resultados_alunos, report_file)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')