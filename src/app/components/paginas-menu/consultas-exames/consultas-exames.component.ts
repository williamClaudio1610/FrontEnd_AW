import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { PedidoMarcacaoServiceService } from '../../../services/pedido-marcacao-service.service';
import { CreatePedidoMarcacaoDTO, CreatePedidoMarcacaoUtenteNaoRegistadoDTO } from '../../../models/pedido-marcacao';
import { CreateActoClinicoDTO } from '../../../models/acto-clinico';
import { CreateUserNaoRegistadoDTO } from '../../../models/usuario';
import { TipoDeConsultaExameService } from '../../../services/tipo-de-consulta-exame.service';
import { TipoDeConsultaExameDTO } from '../../../models/tipo-de-consulta-exame';
import { ProfissionalService } from '../../../services/profissional.service';
import { ProfissionalDTO } from '../../../models/profissional';
import { SubsistemaSaudeService } from '../../../services/subsistema-saude.service';
import { SubsistemaSaudeDTO } from '../../../models/subsistema-saude';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-consultas-exames',
  standalone: false,
  templateUrl: './consultas-exames.component.html',
  styleUrl: './consultas-exames.component.css',
  providers: [MessageService]
})
export class ConsultasExamesComponent implements OnInit {
  // Formulário principal para dados da marcação
  registerForm: FormGroup;
  
  // Formulário para adicionar actos clínicos
  actoForm: FormGroup;
  
  isSubmitted: boolean = false;
  today: Date = new Date();
  
  // Array para armazenar os actos clínicos selecionados
  actosClinicos: CreateActoClinicoDTO[] = [];
  
  // Dados para os dropdowns
  subsistemas: any[] = [];
  tiposConsulta: any[] = [];
  profissionais: any[] = [];
  filteredProfissionais: any[] = [];

  // Formulário para usuário anônimo
  anonUserForm: FormGroup;
  showAnonDialog: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private subsistemaService: SubsistemaSaudeService,
    private tipoConsultaExameService: TipoDeConsultaExameService,
    private profissionalService: ProfissionalService,
    private usuarioService: UsuarioService,
    private pedidoService: PedidoMarcacaoServiceService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    // Formulário principal para dados da marcação
    this.registerForm = this.fb.group({
      dataRange: [null, Validators.required],
      horario: ['', Validators.required],
      observacoes: ['', [Validators.maxLength(100)]]
    });
    
    // Formulário para adicionar actos clínicos
    this.actoForm = this.fb.group({
      subsistema: ['', Validators.required],
      tipoConsulta: ['', Validators.required],
      profissional: [null]
    });
    
    // Formulário para usuário anônimo
    this.anonUserForm = this.fb.group({
      nome: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
      telemovel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      morada: ['', Validators.required],
      fotografia: [''], // Campo para o arquivo
      numeroUtente: ['']
    });
  }

  ngOnInit(): void {
    this.loadSubsistemas();
    this.loadTiposConsulta();
    this.loadProfissionais();
  }

  /** Carrega os subsistemas do backend */
  loadSubsistemas(): void {
    this.subsistemaService.getAllSubsistemasSaude().subscribe({
      next: (data: SubsistemaSaudeDTO[]) => {
        this.subsistemas = data.map(item => ({ label: item.nome, value: item.id }));
      },
      error: (err) => {
        console.error('Erro ao carregar subsistemas:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao Carregar Dados',
          detail: 'Falha ao carregar subsistemas de saúde. Tente recarregar a página.',
          life: 5000
        });
      }
    });
  }

  /** Carrega os tipos de consulta/exame do backend */
  loadTiposConsulta(): void {
    this.tipoConsultaExameService.getAllTipos().subscribe({
      next: (data: TipoDeConsultaExameDTO[]) => {
        this.tiposConsulta = data.map(item => ({ label: item.nome, value: item.id }));
      },
      error: (err) => {
        console.error('Erro ao carregar tipos de consulta/exame:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao Carregar Dados',
          detail: 'Falha ao carregar tipos de consulta/exame. Tente recarregar a página.',
          life: 5000
        });
      }
    });
  }

  /** Carrega os profissionais do backend */
  loadProfissionais(): void {
    this.profissionalService.getAllProfissionais().subscribe({
      next: (data: ProfissionalDTO[]) => {
        this.profissionais = data.map(item => ({
          label: item.nome,
          value: item.id,
          tipoDeConsultaExameId: item.tipoDeConsultaExameId
        }));
        this.filteredProfissionais = [];
      },
      error: (err) => {
        console.error('Erro ao carregar profissionais:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao Carregar Dados',
          detail: 'Falha ao carregar profissionais. Tente recarregar a página.',
          life: 5000
        });
      }
    });
  }

  /** Filtra os profissionais com base no tipo de consulta/exame */
  onTipoConsultaChange(event: any): void {
    const selectedTipoId = event.value;
    if (selectedTipoId) {
      this.filteredProfissionais = this.profissionais.filter(prof => 
        prof.tipoDeConsultaExameId === selectedTipoId
      );
    } else {
      this.filteredProfissionais = [];
    }
    this.actoForm.get('profissional')?.setValue(null);
  }

  /** Manipula o upload de arquivo para usuário anônimo */
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.anonUserForm.patchValue({ fotografia: file.name });
    }
  }

  /** Adiciona um acto clínico à lista */
  onAddActo(): void {
    if (this.actoForm.valid) {
      const formValue = this.actoForm.value;
      const actoClinico: CreateActoClinicoDTO = {
        tipoDeConsultaExameId: formValue.tipoConsulta,
        subsistemaSaudeId: formValue.subsistema,
        profissionalId: formValue.profissional
      };
      this.actosClinicos.push(actoClinico);
      this.messageService.add({
        severity: 'success',
        summary: 'Acto Adicionado',
        detail: 'Acto clínico adicionado com sucesso à sua solicitação',
        life: 3000
      });
      this.actoForm.reset();
      this.filteredProfissionais = [];
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Obrigatórios',
        detail: 'Preencha todos os campos obrigatórios do acto clínico',
        life: 4000
      });
    }
  }

  /** Remove um acto clínico da lista */
  removeActo(index: number): void {
    this.actosClinicos.splice(index, 1);
    this.messageService.add({
      severity: 'info',
      summary: 'Acto Removido',
      detail: 'Acto clínico removido da sua solicitação',
      life: 3000
    });
  }

  /** Solicita a marcação - usuário registado */
  onSolicitarMarcacao(): void {
    if (this.actosClinicos.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Adicione pelo menos um acto clínico antes de solicitar a marcação'
      });
      return;
    }

    if (this.registerForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios do formulário'
      });
      return;
    }

    const [dataInicio, dataFim] = this.registerForm.get('dataRange')?.value || [];
    const horario = this.registerForm.get('horario')?.value || '';
    const observacoes = this.registerForm.get('observacoes')?.value || '';

    if (!dataInicio || !dataFim) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Selecione o período de datas desejado'
      });
      return;
    }

    if (this.usuarioService.isAuthenticated()) {
      const userId = this.usuarioService.getCurrentUser()?.id || 0;
      
      // Estrutura exata conforme o JSON do backend
      const pedido: CreatePedidoMarcacaoDTO = {
        userId: userId,
        dataInicio: new Date(dataInicio).toISOString().split('T')[0],
        dataFim: new Date(dataFim).toISOString().split('T')[0],
        horario: horario,
        observacoes: observacoes,
        actosClinicos: this.actosClinicos
      };

      this.pedidoService.criarPedidoMarcacao(pedido).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Marcação Solicitada!',
            detail: 'Sua marcação foi enviada com sucesso. Será processada em breve.',
            life: 5000
          });
          
          // Limpar formulários
          this.actosClinicos = [];
          this.registerForm.reset();
          this.actoForm.reset();
          
          // Redirecionar após 3 segundos para dar tempo de ver a mensagem
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 3000);
        },
        error: (err) => {
          console.error('Erro ao criar pedido:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro na Solicitação',
            detail: err.message || 'Falha ao solicitar marcação. Tente novamente.',
            life: 5000
          });
        }
      });
    } else {
      this.showAnonDialog = true;
    }
  }

  /** Solicita a marcação - usuário anônimo */
  onAnonSubmit(): void {
    if (this.anonUserForm.valid) {
      const [dataInicio, dataFim] = this.registerForm.get('dataRange')?.value || [];
      const horario = this.registerForm.get('horario')?.value || '';
      const observacoes = this.registerForm.get('observacoes')?.value || '';

      if (!dataInicio || !dataFim) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Selecione o período de datas desejado'
        });
        return;
      }

      // Criar objeto JSON para envio
      const anonUserData = this.anonUserForm.value;
      
      // Preparar dados do usuário
      const userData: CreateUserNaoRegistadoDTO = {
        nome: anonUserData.nome,
        dataNascimento: new Date(anonUserData.dataNascimento).toISOString().split('T')[0],
        genero: anonUserData.genero === 'Masculino' ? 'Masculino' : anonUserData.genero === 'Feminino' ? 'Feminino' : anonUserData.genero,
        telemovel: anonUserData.telemovel,
        email: anonUserData.email,
        morada: anonUserData.morada,
        perfil: 'UtenteAnónimo',
        numeroUtente: anonUserData.numeroUtente,
        fotografia: this.selectedFile ? this.selectedFile.name : 'nenhuma'
      };
      
      // Preparar dados do pedido
      const pedidoData: CreatePedidoMarcacaoUtenteNaoRegistadoDTO = {
        user: userData,
        dataInicio: new Date(dataInicio).toISOString().split('T')[0],
        dataFim: new Date(dataFim).toISOString().split('T')[0],
        horario: horario,
        observacoes: observacoes,
        actosClinicos: this.actosClinicos
      };

      // Debug: Log do JSON que está sendo enviado
      console.log('JSON sendo enviado para criarPedidoUserNaoRegistado:', JSON.stringify(pedidoData, null, 2));

      this.pedidoService.criarPedidoUserNaoRegistado(pedidoData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Conta Criada e Marcação Solicitada!',
            detail: 'Sua conta foi criada e a marcação foi enviada com sucesso. Faça login para ativar sua conta.',
            life: 6000
          });
          
          // Limpar formulários
          this.actosClinicos = [];
          this.showAnonDialog = false;
          this.anonUserForm.reset();
          this.selectedFile = null;
          this.registerForm.reset();
          this.actoForm.reset();
          
          // Redirecionar após 4 segundos para dar tempo de ver a mensagem
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 4000);
        },
        error: (err) => {
          console.error('Erro ao criar pedido anônimo:', err);
          console.error('Detalhes do erro:', {
            status: err.status,
            statusText: err.statusText,
            error: err.error,
            message: err.message
          });
          
          let errorMessage = 'Falha ao solicitar marcação como usuário anônimo. Tente novamente.';
          
          if (err.error?.errors) {
            const validationErrors = Object.values(err.error.errors).flat().join(', ');
            errorMessage = `Erro de validação: ${validationErrors}`;
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.message) {
            errorMessage = err.message;
          }
          
          this.messageService.add({
            severity: 'error',
            summary: 'Erro na Solicitação',
            detail: errorMessage,
            life: 5000
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios do formulário'
      });
    }
  }

  /** Cancela o diálogo de usuário anônimo */
  cancelAnonDialog(): void {
    this.showAnonDialog = false;
    this.anonUserForm.reset();
    this.selectedFile = null;
  }

  /** Obtém o nome do subsistema para exibição */
  getSubsistemaName(id: number): string {
    const subsistema = this.subsistemas.find(s => s.value === id);
    return subsistema ? subsistema.label : 'Sem Subsistema';
  }

  /** Obtém o nome do tipo de consulta para exibição */
  getTipoConsultaName(id: number): string {
    const tipo = this.tiposConsulta.find(t => t.value === id);
    return tipo ? tipo.label : 'Sem Tipo';
  }

  /** Obtém o nome do profissional para exibição */
  getProfissionalName(id: number): string {
    const profissional = this.profissionais.find(p => p.value === id);
    return profissional ? profissional.label : 'Sem Profissional';
  }

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Adicione lógica de filtragem da tabela se necessário
  }
}