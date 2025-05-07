import { Component } from '@angular/core';

@Component({
  selector: 'app-consultas-exames',
  standalone: false,
  templateUrl: './consultas-exames.component.html',
  styleUrl: './consultas-exames.component.css'
})
export class ConsultasExamesComponent {
  consultas = [
    { nome: 'Cardiologia', descricao: 'Consulta com especialista em coração' },
    { nome: 'Dermatologia', descricao: 'Avaliação de pele e tratamentos' },
    { nome: 'Pediatria', descricao: 'Cuidados para crianças e bebês' }
  ];

  exames = [
    { nome: 'Hemograma', descricao: 'Análise completa do sangue' },
    { nome: 'Raio-X', descricao: 'Exame de imagem para ossos' },
    { nome: 'Ultrassom', descricao: 'Visualização de órgãos internos' }
  ];

}
