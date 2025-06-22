import { Component } from '@angular/core';
import { Usuario } from '../../../models/usuario';
import { CreateUserDTO } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-perfil-user',
  standalone: false,
  providers: [MessageService],
  templateUrl: './perfil-user.component.html',
  styleUrl: './perfil-user.component.css'
})
export class PerfilUserComponent {
  user: Usuario | null = null;
  editUser: CreateUserDTO = {
    fotografia: undefined,
    nome: '',
    email: '',
    senhaHash: '',
    perfil: 'UtenteRegistado',
    telemovel: '',
    morada: '',
    dataNascimento: undefined,
    genero: ''
  };
  isEditing = false;
  marcacoes: Marcacao[] = [
    { 
      id: 1, 
      nome: 'Consulta Geral', 
      estado: 'Confirmada', 
      actosClinicos: ['Exame de Sangue', 'Check-up'],
      data: new Date('2023-06-15'),
      hora: '14:30',
      medico: 'Dr. Carlos Mendes',
      local: 'Clínica Saúde Total - Sala 203'
    },
    { 
      id: 2, 
      nome: 'Exame Especial', 
      estado: 'Pendente', 
      actosClinicos: ['Raio-X', 'Ultrassom'],
      data: new Date('2023-07-20'),
      hora: '10:00',
      medico: 'Dra. Ana Sousa',
      local: 'Hospital Central - Bloco B, Sala 10'
    }
  ];
  expandedAppointments: { [key: number]: boolean } = {};

  genders: SelectItem[] = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Feminino', value: 'Feminino' },
    { label: 'Outro', value: 'Outro' }
  ];

  constructor(private usuarioService: UsuarioService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.user = {
      id: 1015,
      numeroUtente: '20258237',
      nome: 'TesteUser',
      email: 'teste@example.com',
      perfil: 'UtenteRegistado',
      dataNascimento: '1990-01-01',
      genero: 'Masculino',
      telemovel: '+244912345678',
      morada: 'Rua Exemplo, Luanda',
      fotografia: '/uploads/fd1b0055-40b7-48a0-8484-6db1d8a37642.png'
    };
    if (this.user) {
      this.editUser = {
        fotografia: undefined,
        nome: this.user.nome,
        email: this.user.email,
        senhaHash: '',
        perfil: this.user.perfil,
        telemovel: this.user.telemovel || '',
        morada: this.user.morada || '',
        dataNascimento: this.user.dataNascimento,
        genero: this.user.genero || ''
      };
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onSubmit(): void {
    this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Perfil atualizado! (Simulação)' });
    this.isEditing = false;
  }

  getMarcacoesByEstado(estado: string): number {
    return this.marcacoes.filter(m => m.estado === estado).length;
  }

  toggleAppointmentDetails(marcacao: Marcacao): void {
    this.expandedAppointments[marcacao.id] = !this.expandedAppointments[marcacao.id];
  }

  isAppointmentExpanded(marcacao: Marcacao): boolean {
    return this.expandedAppointments[marcacao.id] || false;
  }

  newAppointment(): void {
    // Lógica para nova marcação
    this.messageService.add({ severity: 'info', summary: 'Informação', detail: 'Funcionalidade de nova marcação' });
  }
}

interface Marcacao {
  id: number;
  nome: string;
  estado: string;
  actosClinicos: string[];
  data: Date;
  hora: string;
  medico: string;
  local: string;
}