import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-consultas-exames',
  standalone: false,
  templateUrl: './consultas-exames.component.html',
  styleUrl: './consultas-exames.component.css',
  providers: [MessageService]
})
export class ConsultasExamesComponent {
  registerForm: FormGroup;
  isSubmitted: boolean = false;
  today: Date = new Date();
  formattedActosClinicos: any[] = [];
  subsistemas: any[] = [
    { name: 'Medis', value: 'medis' },
    { name: 'SNS', value: 'sns' }
  ];
  tiposConsulta: any[] = [
    { name: 'Consulta Oftalmologia', value: 'oftalmologia' },
    { name: 'Consulta Geral', value: 'geral' }
  ];
  profissionais: any[] = [
    { name: 'queque', value: 'queque' },
    { name: 'Sem Profissional', value: 'sem_profissional' }
  ];

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.registerForm = this.fb.group({
      horarioSolicitado: ['', Validators.required],
      dataRange: ['', Validators.required],
      subsistema: ['', Validators.required],
      tipodeconsulta: ['', Validators.required],
      profissional: [''],
      observacoesAdicionais: ['', [Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    /*
    this.formattedActosClinicos = [
      {
        subsistemaSaude: 'SNS',
        tipoConsulta: 'Consulta Oftalmologia',
        profissional: 'queque',
        horario: '19:01'
      },
      {
        subsistemaSaude: 'SNS',
        tipoConsulta: 'Consulta Oftalmologia',
        profissional: 'Sem Profissional',
        horario: '18:01'
      }
    ];
    */
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const newActo = {
        subsistemaSaude: formValue.subsistema.name || 'Sem Subsistema',
        tipoConsulta: formValue.tipodeconsulta.name || 'Sem Tipo',
        profissional: formValue.profissional?.name || 'Sem Profissional',
        horario: formValue.horarioSolicitado || 'Sem Horário',
        observacoesAdicionais: formValue.observacoesAdicionais || 'Sem Observações'
      };
      this.formattedActosClinicos.push(newActo);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Acto clínico adicionado'
      });
      this.registerForm.reset();
      this.isSubmitted = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos obrigatórios'
      });
    }
  }

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Add table filtering logic if needed (requires Table reference)
  }
}