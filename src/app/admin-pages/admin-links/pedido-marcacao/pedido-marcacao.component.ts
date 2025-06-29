import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { PedidoMarcacaoDTO, UpdatePedidoMarcacaoDTO } from '../../../models/pedido-marcacao';
import { ActoClinicoDTO } from '../../../models/acto-clinico';
import { TipoDeConsultaExameDTO } from '../../../models/tipo-de-consulta-exame';
import { SubsistemaSaudeDTO } from '../../../models/subsistema-saude';
import { ProfissionalDTO } from '../../../models/profissional';
import { PedidoMarcacaoServiceService } from '../../../services/pedido-marcacao-service.service';
import { UsuarioService } from '../../../services/usuario.service';

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
    CalendarModule
  ],
  providers: [ConfirmationService, MessageService]
})
export class PedidoMarcacaoComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  pedidos: PedidoMarcacaoDTO[] = [];
  filteredPedidos: PedidoMarcacaoDTO[] = [];
  expandedPedidos = new Set<number>();
  searchTerm = '';

  // Dialog de confirmação de estado
  showEstadoDialog = false;
  selectedPedido: PedidoMarcacaoDTO | null = null;
  newEstado = '';
  previousEstado = '';

  estadoOptions = [
    { label: 'Pendente', value: 'PENDENTE' },
    { label: 'Aprovado', value: 'APROVADO' },
    { label: 'Rejeitado', value: 'REJEITADO' },
    { label: 'Cancelado', value: 'CANCELADO' }
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    private pedidoService: PedidoMarcacaoServiceService,
    private usuarioService: UsuarioService,
    private toastService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  // Carregar todos os pedidos
  loadPedidos(): void {
    this.pedidoService.getTodosPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos.map(pedido => ({
          ...pedido,
          estado: pedido.estado || 'PENDENTE',
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

  // Mudança de estado
  onEstadoChange(pedido: PedidoMarcacaoDTO, event: any): void {
    const novoEstado = event.value;
    this.openEstadoDialog(pedido);
  }

  // Confirmação de ação
  confirmAction(pedido: PedidoMarcacaoDTO, action: string): void {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja ${action.toLowerCase()} este pedido?`,
      accept: () => {
        // Simulação de ação (substituir por chamada à API)
        console.log(`Ação ${action} confirmada para pedido ${pedido.id}`);
        this.toastService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Ação ${action} realizada com sucesso.`,
          life: 3000
        });
      }
    });
  }

  // Converte código de estado para label
  getEstadoLabel(estado: string): string {
    const estadoOption = this.estadoOptions.find(option => option.value === estado);
    return estadoOption ? estadoOption.label : 'Estado Desconhecido';
  }

  // Métodos do diálogo de mudança de estado
  openEstadoDialog(pedido: PedidoMarcacaoDTO): void {
    this.selectedPedido = { ...pedido }; // Clonar para evitar alterações diretas
    this.previousEstado = pedido.estado;
    this.newEstado = pedido.estado; // Inicializa com o estado atual
    this.showEstadoDialog = true;
  }

  cancelEstadoChange(): void {
    if (this.selectedPedido) {
      this.selectedPedido.estado = this.previousEstado;
    }
    this.showEstadoDialog = false;
  }

  confirmEstadoChange(): void {
    if (this.selectedPedido && this.newEstado && this.newEstado !== this.previousEstado) {
      // Chamar serviço para atualizar o estado
      const updateDTO: UpdatePedidoMarcacaoDTO = {
        id: this.selectedPedido.id,
        estado: this.newEstado,
        dataInicio: this.selectedPedido.dataInicio,
        dataFim: this.selectedPedido.dataFim,
        observacoes: this.selectedPedido.observacoes,
        actosClinicos: this.selectedPedido.actosClinicos.map(acto => ({
          tipoDeConsultaExameId: acto.tipoDeConsultaExameId,
          subsistemaSaudeId: acto.subsistemaSaudeId,
          profissionalIds: acto.profissionais?.map(p => p.id) || []
        }))
      };

      this.pedidoService.atualizarPedido(updateDTO).subscribe({
        next: (response) => {
          this.selectedPedido!.estado = this.newEstado;
          const index = this.pedidos.findIndex(p => p.id === this.selectedPedido!.id);
          if (index !== -1) this.pedidos[index] = { ...this.selectedPedido! };
          this.filterPedidos();
          this.showEstadoDialog = false;
          this.toastService.add({
            severity: 'success',
            summary: 'Estado Atualizado',
            detail: `O estado do pedido foi atualizado para ${this.newEstado}`,
            life: 3000
          });
        },
        error: (err) => {
          this.toastService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao atualizar estado: ' + (err.error?.message || err.message),
            life: 3000
          });
          this.selectedPedido!.estado = this.previousEstado;
          this.showEstadoDialog = false;
        }
      });
    } else {
      this.showEstadoDialog = false;
    }
  }
}