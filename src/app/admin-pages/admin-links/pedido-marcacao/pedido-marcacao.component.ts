import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormArray, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { PedidoMarcacaoDTO, UpdatePedidoMarcacaoDTO } from '../../../models/pedido-marcacao';
import { ActoClinicoDTO, UpdateActoClinicoDTO } from '../../../models/acto-clinico';
import { TipoDeConsultaExameDTO } from '../../../models/tipo-de-consulta-exame';
import { SubsistemaSaudeDTO } from '../../../models/subsistema-saude';
import { ProfissionalDTO } from '../../../models/profissional';
import { PedidoMarcacaoServiceService } from '../../../services/pedido-marcacao-service.service';
import { UsuarioService } from '../../../services/usuario.service';
import { TipoDeConsultaExameService } from '../../../services/tipo-de-consulta-exame.service';
import { SubsistemaSaudeService } from '../../../services/subsistema-saude.service';
import { ProfissionalService } from '../../../services/profissional.service';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-pedidos-marcacao',
  standalone: true,
  templateUrl: `pedido-marcacao.component.html`,
  styleUrl: `pedido-marcacao.component.css`,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    DialogModule,
    CardModule,
    TagModule,
    AccordionModule,
    PanelModule,
    ConfirmDialogModule,
    ToastModule,
    InputTextModule,
    CalendarModule,
    MultiSelectModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class PedidoMarcacaoComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  pedidos: PedidoMarcacaoDTO[] = [];
  filteredPedidos: PedidoMarcacaoDTO[] = [];
  expandedPedidos = new Set<number>();
  searchTerm = '';



  estadoOptions = [
    { label: 'Pedido', value: 'Pedido' },
    { label: 'Agendado', value: 'Agendado' },
    { label: 'Realizado', value: 'Realizado' },
    { label: 'Cancelado', value: 'Cancelado' }
  ];

  // Novo: Formulário de edição simplificado
  pedidoForm: FormGroup | null = null;
  showEditDialog = false;

  tiposConsultaOptions: TipoDeConsultaExameDTO[] = [];
  subsistemasOptions: SubsistemaSaudeDTO[] = [];
  profissionaisOptions: ProfissionalDTO[] = [];

  constructor(
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private pedidoService: PedidoMarcacaoServiceService,
    private usuarioService: UsuarioService,
    private toastService: MessageService,
    private tipoDeConsultaExameService: TipoDeConsultaExameService,
    private subsistemaSaudeService: SubsistemaSaudeService,
    private profissionalService: ProfissionalService
  ) {
    this.carregarOpcoes();
  }

  ngOnInit(): void {
    this.loadPedidos();
  }

  // Carregar todos os pedidos
  loadPedidos(): void {
    this.pedidoService.getTodosPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos.map(pedido => ({
          ...pedido,
          estado: pedido.estado,
          observacoes: pedido.observacoes || 'Sem observações',
          actosClinicos: pedido.actosClinicos || [] // Default to empty array if undefined
        })) as PedidoMarcacaoDTO[];
        this.filterPedidos();
      },
      error: (err) => {
        this.toastService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar pedidos: ' + (err.error?.message || err.message),
          life: 3000
        });
      }
    });
  }

  // Função para inicializar os dados
  initializeData(): void {
    // Não usado mais, mantido como fallback se necessário
  }

  // Formatação de datas
  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj ? dateObj.toLocaleDateString() : '';
  }

  formatDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj ? dateObj.toLocaleString() : '';
  }

  // Formatar hora para exibição
  formatTime(time: string): string {
    if (!time) return '';
    // Se já está no formato hh:mm, retornar como está
    if (time.includes(':')) {
      return time;
    }
    // Se for um DateTime completo, extrair apenas a hora
    if (time.includes('T')) {
      const timePart = time.split('T')[1];
      return timePart.substring(0, 5); // Pegar apenas hh:mm
    }
    return time;
  }

  // Filtros
  filterPedidos(): void {
    const searchTermLower = (this.searchTerm || '').toLowerCase();
    
    this.filteredPedidos = this.pedidos.filter(pedido => {
      return (
        pedido.id.toString().includes(searchTermLower) ||
        pedido.userId.toString().includes(searchTermLower) ||
        (pedido.observacoes?.toLowerCase() || '').includes(searchTermLower) || // Correção aqui
        (pedido.actosClinicos || []).some(acto => 
          (acto?.tipoDeConsultaExame?.nome?.toLowerCase() || '').includes(searchTermLower) // Correção aqui
        )
      );
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filterPedidos();
  }

  // Gerenciamento de detalhes
  toggleDetalhes(pedidoId: number): void {
    if (this.expandedPedidos.has(pedidoId)) {
      this.expandedPedidos.delete(pedidoId);
    } else {
      this.expandedPedidos.add(pedidoId);
    }
  }

  // Converte código de estado para label
  getEstadoLabel(estado: string): string {
    const estadoOption = this.estadoOptions.find(option => option.value === estado);
    return estadoOption ? estadoOption.label : 'Estado Desconhecido';
  }

  // Novo: Abrir modal de edição simplificado
  openEditDialog(pedido: PedidoMarcacaoDTO): void {
    this.pedidoForm = this.fb.group({
      id: [pedido.id],
      estado: [pedido.estado, Validators.required],
      dataInicio: [pedido.dataInicio, Validators.required],
      dataFim: [pedido.dataFim, Validators.required],
      observacoes: [pedido.observacoes || '', Validators.required],
      actosClinicos: this.fb.array((pedido.actosClinicos || []).map((acto: any) => this.fb.group({
        id: [acto.id],
        pedidoMarcacaoId: [pedido.id],
        tipoDeConsultaExameId: [acto.tipoDeConsultaExameId, Validators.required],
        subsistemaSaudeId: [acto.subsistemaSaudeId, Validators.required],
        dataHora: [acto.dataHora || ''],
        anoMesDia: [acto.anoMesDia || ''],
        profissionalId: [acto.profissional ? acto.profissional.id : null, Validators.required]
      })))
    });
    
    // Aplicar validações baseadas no estado atual
    setTimeout(() => {
      this.onEstadoChange();
    }, 0);
    
    this.showEditDialog = true;
  }

  get actosClinicosFormArray(): FormArray {
    return (this.pedidoForm?.get('actosClinicos') as FormArray);
  }

  // Atualizar validações quando o estado mudar
  onEstadoChange(): void {
    if (!this.pedidoForm) return;
    
    const estado = this.pedidoForm.get('estado')?.value;
    const isAgendado = estado === 'Agendado';
    
    // Atualizar validações dos atos clínicos
    this.actosClinicosFormArray.controls.forEach(control => {
      const dataHoraControl = control.get('dataHora');
      const anoMesDiaControl = control.get('anoMesDia');
      
      if (dataHoraControl) {
        if (isAgendado) {
          dataHoraControl.setValidators([Validators.required]);
        } else {
          dataHoraControl.clearValidators();
        }
        dataHoraControl.updateValueAndValidity();
      }
      
      if (anoMesDiaControl) {
        if (isAgendado) {
          anoMesDiaControl.setValidators([Validators.required]);
        } else {
          anoMesDiaControl.clearValidators();
        }
        anoMesDiaControl.updateValueAndValidity();
      }
    });
  }

  // Novo: Submissão do formulário de edição
  onSubmitEdit(): void {
    if (!this.pedidoForm || this.pedidoForm.invalid) return;
    
    const formValue = this.pedidoForm.value;
    
    // Validar se o estado AGENDADO tem data/hora para todos os atos clínicos
    if (formValue.estado === 'Agendado') {
      const actosSemDataHora = formValue.actosClinicos.filter((acto: any) => !acto.dataHora || !acto.anoMesDia);
      if (actosSemDataHora.length > 0) {
        this.toastService.add({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Para agendar um pedido, todos os atos clínicos devem ter data e hora definidas.',
          life: 5000
        });
        return;
      }
    }

    // Função para formatar data para YYYY-MM-DD
    const formatDateToString = (date: any): string => {
      if (!date) return '';
      if (typeof date === 'string') return date;
      if (date instanceof Date) {
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
      }
      return '';
    };

    // Função para formatar hora para hh:mm (TimeOnly)
    const formatTimeToString = (time: string): string => {
      if (!time) return '';
      // Garantir que está no formato hh:mm
      if (time.includes(':')) {
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      }
      return time;
    };

    const updateDTO: UpdatePedidoMarcacaoDTO = {
      id: formValue.id,
      estado: formValue.estado,
      dataInicio: formatDateToString(formValue.dataInicio),
      dataFim: formatDateToString(formValue.dataFim),
      observacoes: formValue.observacoes,
      actosClinicos: (formValue.actosClinicos as any[]).map((acto: any): UpdateActoClinicoDTO => ({
        id: acto.id,
        pedidoMarcacaoId: acto.pedidoMarcacaoId,
        tipoDeConsultaExameId: acto.tipoDeConsultaExameId,
        subsistemaSaudeId: acto.subsistemaSaudeId,
        dataHora: formatTimeToString(acto.dataHora),
        anoMesDia: formatDateToString(acto.anoMesDia),
        profissionalId: acto.profissionalId
      }))
    };
    
    this.pedidoService.atualizarPedido(updateDTO).subscribe({
      next: (response) => {
        this.showEditDialog = false;
        this.loadPedidos();
        this.toastService.add({
          severity: 'success',
          summary: 'Pedido atualizado',
          detail: 'O pedido foi atualizado com sucesso!',
          life: 3000
        });
      },
      error: (err) => {
        this.toastService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao atualizar pedido: ' + (err.error?.message || err.message),
          life: 3000
        });
      }
    });
  }

  carregarOpcoes(): void {
    this.tipoDeConsultaExameService.getAllTipos().subscribe((data: TipoDeConsultaExameDTO[]) => this.tiposConsultaOptions = data);
    this.subsistemaSaudeService.getAllSubsistemasSaude().subscribe((data: SubsistemaSaudeDTO[]) => this.subsistemasOptions = data);
    this.profissionalService.getAllProfissionais().subscribe((data: ProfissionalDTO[]) => this.profissionaisOptions = data);
  }

  // Métodos auxiliares para o template
  getTipoConsultaNome(id: number): string {
    const tipo = this.tiposConsultaOptions.find(t => t.id === id);
    return tipo ? tipo.nome : 'Tipo não encontrado';
  }

  getSubsistemaNome(id: number): string {
    const subsistema = this.subsistemasOptions.find(s => s.id === id);
    return subsistema ? subsistema.nome : 'Subsistema não encontrado';
  }

  getProfissionalNome(id: number): string {
    const profissional = this.profissionaisOptions.find(p => p.id === id);
    return profissional ? profissional.nome : 'Profissional não encontrado';
  }
}