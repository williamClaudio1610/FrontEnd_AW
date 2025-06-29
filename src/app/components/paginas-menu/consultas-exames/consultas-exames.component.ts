import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
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
  registerForm: FormGroup;
  isSubmitted: boolean = false;
  today: Date = new Date();
  formattedActosClinicos: any[] = [];
  
  subsistemas: any[] = [];
  tiposConsulta: any[] = [];
  profissionais: any[] = [];
  filteredProfissionais: any[] = [];

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
    private cd: ChangeDetectorRef    
  ) {
    this.registerForm = this.fb.group({
      subsistema: ['', Validators.required],
      tipodeconsulta: ['', Validators.required],
      profissional: [null],
      observacoesAdicionais: ['', [Validators.maxLength(100)]],
      dataRange: [null, Validators.required] // Tornado obrigatório
    });
    
    this.anonUserForm = this.fb.group({
      nome: ['', Validators.required],
      numeroUtente: ['', Validators.required],
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
      telemovel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      morada: ['', Validators.required],
      fotografia: [''] // Campo para o arquivo
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
          summary: 'Erro',
          detail: 'Falha ao carregar subsistemas'
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
          summary: 'Erro',
          detail: 'Falha ao carregar tipos de consulta/exame'
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
          summary: 'Erro',
          detail: 'Falha ao carregar profissionais'
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
    this.registerForm.get('profissional')?.setValue(null);
  }

  /** Manipula o upload de arquivo para usuário anônimo */
  onFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      this.selectedFile = file;
      this.anonUserForm.patchValue({ fotografia: file.name });
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      // Criar o acto clínico corretamente estruturado
      const newActo = {
        tipoDeConsultaExameId: formValue.tipodeconsulta,
        subsistemaSaudeId: formValue.subsistema,
        profissionalIds: formValue.profissional ? [formValue.profissional] : [],
        // Dados para exibição
        displayData: {
          subsistemaSaude: this.subsistemas.find(s => s.value === formValue.subsistema)?.label || 'Sem Subsistema',
          tipoConsulta: this.tiposConsulta.find(t => t.value === formValue.tipodeconsulta)?.label || 'Sem Tipo',
          profissional: formValue.profissional
            ? this.profissionais.find(p => p.value === formValue.profissional)?.label || 'Sem Profissional'
            : 'Sem Profissional'
        }
      };

      this.formattedActosClinicos.push(newActo);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Acto clínico adicionado'
      });

      // Reset apenas os campos do acto clínico, mantendo dataRange e observações
      this.registerForm.patchValue({
        subsistema: '',
        tipodeconsulta: '',
        profissional: null
      });
      this.filteredProfissionais = [];
      this.isSubmitted = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos obrigatórios'
      });
    }
  }

  onSolicitarMarcacao(): void {
    if (this.formattedActosClinicos.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Adicione pelo menos um acto clínico'
      });
      return;
    }

    const [dataInicio, dataFim] = this.registerForm.get('dataRange')?.value || [];
    const observacoes = this.registerForm.get('observacoesAdicionais')?.value || '';

    if (!dataInicio || !dataFim) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Selecione o período de datas desejado'
      });
      return;
    }

    if (this.usuarioService.isAuthenticated()) {
      const userId = this.usuarioService.getCurrentUser()?.id || 0;
      
      // Estrutura correta conforme o JSON do backend
      const pedido: CreatePedidoMarcacaoDTO = {
        userId,
        dataInicio: new Date(dataInicio).toISOString().split('T')[0],
        dataFim: new Date(dataFim).toISOString().split('T')[0],
        observacoes,
        actosClinicos: this.formattedActosClinicos.map(acto => ({
          tipoDeConsultaExameId: acto.tipoDeConsultaExameId,
          subsistemaSaudeId: acto.subsistemaSaudeId,
          profissionalIds: acto.profissionalIds
        }))
      };

      this.pedidoService.criarPedidoMarcacao(pedido).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Marcação solicitada com sucesso'
          });
          this.formattedActosClinicos = [];
          this.registerForm.reset();
        },
        error: (err) => {
          console.error('Erro ao criar pedido:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.message || 'Falha ao solicitar marcação'
          });
        }
      });
    } else {
      this.showAnonDialog = true;
    }
  }

  onAnonSubmit(): void {
    if (this.anonUserForm.valid) {
      const [dataInicio, dataFim] = this.registerForm.get('dataRange')?.value || [];
      const observacoes = this.registerForm.get('observacoesAdicionais')?.value || '';

      if (!dataInicio || !dataFim) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Selecione o período de datas desejado'
        });
        return;
      }

      // Criar FormData para envio multipart
      const formData = new FormData();
      
      // Adicionar dados do usuário
      const anonUserData = this.anonUserForm.value;
      formData.append('nome', anonUserData.nome);
      formData.append('numeroUtente', anonUserData.numeroUtente);
      formData.append('dataNascimento', new Date(anonUserData.dataNascimento).toISOString().split('T')[0]);
      formData.append('genero', anonUserData.genero);
      formData.append('telemovel', anonUserData.telemovel);
      formData.append('email', anonUserData.email);
      formData.append('morada', anonUserData.morada);
      
      // Adicionar fotografia se selecionada
      if (this.selectedFile) {
        formData.append('fotografia', this.selectedFile);
      }
      
      // Adicionar dados do pedido
      formData.append('dataInicio', new Date(dataInicio).toISOString().split('T')[0]);
      formData.append('dataFim', new Date(dataFim).toISOString().split('T')[0]);
      formData.append('observacoes', observacoes);
      
      // Adicionar actos clínicos como JSON string
      const actosClinicos = this.formattedActosClinicos.map(acto => ({
        tipoDeConsultaExameId: acto.tipoDeConsultaExameId,
        subsistemaSaudeId: acto.subsistemaSaudeId,
        profissionalIds: acto.profissionalIds
      }));
      formData.append('actosClinicos', JSON.stringify(actosClinicos));

      this.pedidoService.criarPedidoUserNaoRegistado(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Marcação solicitada e conta criada. Faça login para ativar sua conta.'
          });
          this.formattedActosClinicos = [];
          this.showAnonDialog = false;
          this.anonUserForm.reset();
          this.selectedFile = null;
          this.registerForm.reset();
        },
        error: (err) => {
          console.error('Erro ao criar pedido anônimo:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.message || 'Falha ao solicitar marcação como usuário anônimo'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos obrigatórios do formulário'
      });
    }
  }

  /** Remove um acto clínico da lista */
  removeActo(index: number): void {
    this.formattedActosClinicos.splice(index, 1);
    this.messageService.add({
      severity: 'info',
      summary: 'Removido',
      detail: 'Acto clínico removido da lista'
    });
  }

  /** Cancela o diálogo de usuário anônimo */
  cancelAnonDialog(): void {
    this.showAnonDialog = false;
    this.anonUserForm.reset();
    this.selectedFile = null;
  }

  onGlobalFilter(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Adicione lógica de filtragem da tabela se necessário
  }
}