import { Component, OnInit } from '@angular/core';
import { Usuario, UpdateUserDTO, ChangePasswordDTO } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { PedidoMarcacaoServiceService } from '../../../services/pedido-marcacao-service.service';
import { PedidoMarcacaoDTO } from '../../../models/pedido-marcacao';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { PdfGeneratorService } from '../../../services/pdf-generator.service';
import { UpdatePedidoMarcacaoDTO } from '../../../models/pedido-marcacao';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-perfil-user',
  standalone: false,
  providers: [MessageService],
  templateUrl: './perfil-user.component.html',
  styleUrl: './perfil-user.component.css'
})
export class PerfilUserComponent implements OnInit {
  user: Usuario | null = null;
  editUser: UpdateUserDTO = {
    id: 0,
    nome: '',
    email: '',
    numeroUtente: '',
    telemovel: '',
    morada: '',
    dataNascimento: '',
    genero: '',
    isBloqueado: false
  };
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  originalUserData: UpdateUserDTO | null = null;
  isEditing = false;
  isChangingPassword = false;
  marcacoes: PedidoMarcacaoDTO[] = [];
  expandedAppointments: { [key: number]: boolean } = {};
  loading = false;
  saving = false;
  changingPassword = false;

  // Controle de diálogos/modal para reagendamento/cancelamento
  showReagendarDialog: boolean = false;
  showCancelamentoDialog: boolean = false;
  reagendarMarcacao: PedidoMarcacaoDTO | null = null;
  cancelamentoMarcacao: PedidoMarcacaoDTO | null = null;
  novoDataInicioSoli: string = '';
  novoDataFimSoli: string = '';
  novoHorarioSoli: string = '';
  motivoCancelamento: string = '';

  // Controle de loading para reagendamento/cancelamento
  reagendando: boolean = false;
  cancelando: boolean = false;

  // Campos para alteração de senha
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Validação de força da senha
  passwordStrength: string = '';
  passwordsMismatch: boolean = false;

  genders: SelectItem[] = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Feminino', value: 'Feminino' },
    { label: 'Outro', value: 'Outro' }
  ];

  constructor(
    private usuarioService: UsuarioService, 
    private pedidoMarcacaoService: PedidoMarcacaoServiceService,
    private messageService: MessageService,
    private pdfGenerator: PdfGeneratorService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadMarcacoes();
  }

  loadUserData(): void {
    this.user = this.usuarioService.getCurrentUser();
    if (this.user) {
      this.editUser = {
        id: this.user.id,
        nome: this.user.nome,
        numeroUtente: this.user.numeroUtente,
        email: this.user.email,
        telemovel: this.user.telemovel || '',
        morada: this.user.morada || '',
        dataNascimento: this.user.dataNascimento || new Date().toISOString().split('T')[0],
        genero: this.user.genero || '',
        isBloqueado: this.user.isBloqueado,
        perfil: this.user.perfil
      };
      this.originalUserData = { ...this.editUser };
    }
  }

  loadMarcacoes(): void {
    if (!this.user?.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Usuário não identificado'
      });
      return;
    }

    this.loading = true;
    this.pedidoMarcacaoService.getByUserId(this.user.id).subscribe({
      next: (marcacoes) => {
        this.marcacoes = marcacoes;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar marcações: ' + (error.message || 'Erro desconhecido')
        });
      }
    });
  }

  // Métodos para validação de senha
  checkPasswordStrength() {
    if (!this.passwordData.newPassword) {
      this.passwordStrength = '';
      return;
    }

    const length = this.passwordData.newPassword.length;
    
    if (length < 8) {
      this.passwordStrength = 'weak';
    } else {
      this.passwordStrength = 'strong';
    }
  }

  checkPasswordsMatch() {
    this.passwordsMismatch = this.passwordData.newPassword !== this.passwordData.confirmPassword && this.passwordData.confirmPassword !== '';
  }

  getPasswordStrengthText(): string {
    switch (this.passwordStrength) {
      case 'weak': return 'Mínimo 8 caracteres';
      case 'strong': return 'Senha válida';
      default: return '';
    }
  }

  getPasswordStrengthClass(): string {
    return `password-strength ${this.passwordStrength}`;
  }

  // Verificar se o pedido pode ser reagendado ou cancelado
  podeReagendarOuCancelar(marcacao: PedidoMarcacaoDTO): boolean {
    const estadosPermitidos = ['Pedido', 'Agendado'];
    return estadosPermitidos.includes(marcacao.estado) && 
           !marcacao.solicitacaoReagendamento && 
           !marcacao.solicitacaoCancelamento;
  }

  // Verificar se já existe solicitação pendente
  temSolicitacaoPendente(marcacao: PedidoMarcacaoDTO): string | null {
    if (marcacao.solicitacaoReagendamento) {
      return 'Reagendamento solicitado';
    }
    if (marcacao.solicitacaoCancelamento) {
      return 'Cancelamento solicitado';
    }
    return null;
  }

  // Abrir diálogo de reagendamento
  openReagendarDialog(marcacao: PedidoMarcacaoDTO): void {
    if (!this.podeReagendarOuCancelar(marcacao)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Este pedido não pode ser reagendado no estado atual.'
      });
      return;
    }

    this.reagendarMarcacao = marcacao;
    this.novoDataInicioSoli = '';
    this.novoDataFimSoli = '';
    this.novoHorarioSoli = '';
    this.showReagendarDialog = true;
  }

  // Fechar diálogo de reagendamento
  closeReagendarDialog(): void {
    this.showReagendarDialog = false;
    this.reagendarMarcacao = null;
    this.novoDataInicioSoli = '';
    this.novoDataFimSoli = '';
    this.novoHorarioSoli = '';
  }

  // Abrir diálogo de cancelamento
  openCancelamentoDialog(marcacao: PedidoMarcacaoDTO): void {
    if (!this.podeReagendarOuCancelar(marcacao)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Este pedido não pode ser cancelado no estado atual.'
      });
      return;
    }

    this.cancelamentoMarcacao = marcacao;
    this.showCancelamentoDialog = true;
  }

  // Fechar diálogo de cancelamento
  closeCancelamentoDialog(): void {
    this.showCancelamentoDialog = false;
    this.cancelamentoMarcacao = null;
  }

  // Validar data de reagendamento
  validarDataReagendamento(): boolean {
    if (!this.novoDataInicioSoli || !this.novoDataFimSoli || !this.novoHorarioSoli) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todas as informações do novo agendamento.'
      });
      return false;
    }

    const dataInicio = new Date(this.novoDataInicioSoli);
    const dataFim = new Date(this.novoDataFimSoli);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataInicio < hoje) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'A data de início deve ser hoje ou uma data futura.'
      });
      return false;
    }

    if (dataFim < dataInicio) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'A data de fim deve ser igual ou posterior à data de início.'
      });
      return false;
    }

    return true;
  }

  // Submeter solicitação de reagendamento
  async solicitarReagendamento(): Promise<void> {
    if (!this.reagendarMarcacao) return;
    
    if (!this.validarDataReagendamento()) return;

    this.reagendando = true;

    const update: UpdatePedidoMarcacaoDTO = {
      id: this.reagendarMarcacao.id,
      estado: this.reagendarMarcacao.estado,
      dataInicio: this.reagendarMarcacao.dataInicio,
      dataFim: this.reagendarMarcacao.dataFim,
      horario: this.reagendarMarcacao.horario,
      observacoes: this.reagendarMarcacao.observacoes || 'Solicitação de reagendamento enviada pelo usuário',
      actosClinicos: this.reagendarMarcacao.actosClinicos.map(acto => ({
        id: acto.id,
        pedidoMarcacaoId: acto.pedidoMarcacaoId,
        tipoDeConsultaExameId: acto.tipoDeConsultaExameId,
        subsistemaSaudeId: acto.subsistemaSaudeId,
        dataHora: acto.dataHora || '',
        anoMesDia: acto.anoMesDia || '',
        profissionalId: acto.profissional?.id || 0
      })),
      solicitacaoReagendamento: true,
      solicitacaoCancelamento: false,
      novoDataInicioSoli: this.novoDataInicioSoli,
      novoDataFimSoli: this.novoDataFimSoli,
      novoHorarioSoli: this.novoHorarioSoli
    };

    try {
      await firstValueFrom(this.pedidoMarcacaoService.atualizarPedido(update));
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Solicitação Enviada', 
        detail: 'Solicitação de reagendamento enviada com sucesso! Aguarde o retorno da clínica.' 
      });
      this.closeReagendarDialog();
      this.loadMarcacoes();
    } catch (err: any) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: err.message || 'Erro ao solicitar reagendamento.' 
      });
    } finally {
      this.reagendando = false;
    }
  }

  // Solicitar cancelamento
  async solicitarCancelamento(): Promise<void> {
    if (!this.cancelamentoMarcacao) return;

    this.cancelando = true;

    const update: UpdatePedidoMarcacaoDTO = {
      id: this.cancelamentoMarcacao.id,
      estado: this.cancelamentoMarcacao.estado,
      dataInicio: this.cancelamentoMarcacao.dataInicio,
      dataFim: this.cancelamentoMarcacao.dataFim,
      horario: this.cancelamentoMarcacao.horario,
      observacoes: this.cancelamentoMarcacao.observacoes || 'Solicitação de cancelamento enviada pelo usuário',
      actosClinicos: this.cancelamentoMarcacao.actosClinicos.map(acto => ({
        id: acto.id,
        pedidoMarcacaoId: acto.pedidoMarcacaoId,
        tipoDeConsultaExameId: acto.tipoDeConsultaExameId,
        subsistemaSaudeId: acto.subsistemaSaudeId,
        dataHora: acto.dataHora || '',
        anoMesDia: acto.anoMesDia || '',
        profissionalId: acto.profissional?.id || 0
      })),
      solicitacaoReagendamento: false,
      solicitacaoCancelamento: true
    };

    try {
      await firstValueFrom(this.pedidoMarcacaoService.atualizarPedido(update));
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Solicitação Enviada', 
        detail: 'Solicitação de cancelamento enviada com sucesso! Aguarde o retorno da clínica.' 
      });
      this.closeCancelamentoDialog();
      this.loadMarcacoes();
    } catch (err: any) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: err.message || 'Erro ao solicitar cancelamento.' 
      });
    } finally {
      this.cancelando = false;
    }
  }

  // Métodos auxiliares existentes (mantidos iguais)
  toggleEdit(): void {
    if (this.isEditing) {
      if (this.hasChanges()) {
        if (confirm('Tem certeza que deseja cancelar? As alterações serão perdidas.')) {
          this.cancelEdit();
        }
      } else {
        this.cancelEdit();
      }
    } else {
      this.isEditing = true;
    }
  }

  togglePasswordChange(): void {
    this.isChangingPassword = !this.isChangingPassword;
    if (!this.isChangingPassword) {
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.passwordStrength = '';
      this.passwordsMismatch = false;
    }
  }

  cancelEdit(): void {
    this.loadUserData();
    this.isEditing = false;
    this.selectedFile = null;
    this.previewUrl = null;
  }

  hasChanges(): boolean {
    if (!this.originalUserData) return false;
    
    return (
      this.editUser.nome !== this.originalUserData.nome ||
      this.editUser.email !== this.originalUserData.email ||
      this.editUser.telemovel !== this.originalUserData.telemovel ||
      this.editUser.numeroUtente !== this.originalUserData.numeroUtente ||
      this.editUser.morada !== this.originalUserData.morada ||
      this.editUser.dataNascimento !== this.originalUserData.dataNascimento ||
      this.editUser.genero !== this.originalUserData.genero ||
      this.selectedFile !== null
    );
  }

  async onSubmit(): Promise<void> {
    // Validações básicas
    if (!this.editUser.nome?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nome é obrigatório'
      });
      return;
    }

    if (!this.editUser.email?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Email é obrigatório'
      });
      return;
    }

    if (!this.editUser.telemovel?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Telemóvel é obrigatório'
      });
      return;
    }

    if (!this.editUser.morada?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Morada é obrigatória'
      });
      return;
    }

    if (this.hasChanges()) {
      this.saving = true;
      
      const updateData: UpdateUserDTO = {
        id: this.user!.id,
        nome: this.editUser.nome.trim(),
        email: this.editUser.email.trim().toLowerCase(),
        numeroUtente: this.editUser.numeroUtente.trim(),
        telemovel: this.editUser.telemovel.trim(),
        morada: this.editUser.morada.trim(),
        genero: this.editUser.genero || '',
        dataNascimento: this.formatDateForBackend(this.editUser.dataNascimento ?? ''),
        fotografia: this.selectedFile || undefined,
        perfil: this.user!.perfil,
        isBloqueado: this.user!.isBloqueado
      };

      try {
        const updatedUser = await firstValueFrom(this.usuarioService.updateUsuario(updateData));
        this.user = updatedUser;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Perfil atualizado com sucesso!'
        });
        this.isEditing = false;
        this.selectedFile = null;
        this.previewUrl = null;
        this.loadUserData();
      } catch (error: any) {
        console.error('Erro ao atualizar perfil:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: error.message || 'Erro ao atualizar perfil'
        });
      } finally {
        this.saving = false;
      }
    }
  }

  formatDateForBackend(date: string | Date): string {
    if (!date) return '';
    
    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return dateObj.toISOString().split('T')[0];
  }

  async onSubmitPassword(): Promise<void> {
    if (!this.passwordData.currentPassword?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Senha atual é obrigatória'
      });
      return;
    }

    if (!this.passwordData.newPassword?.trim()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nova senha é obrigatória'
      });
      return;
    }

    if (this.passwordStrength === 'weak') {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'A senha é muito fraca. Escolha uma senha mais forte.'
      });
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Confirmação de senha não confere'
      });
      return;
    }

    if (!this.user) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Usuário não identificado'
      });
      return;
    }

    this.changingPassword = true;

    const changePasswordDTO: ChangePasswordDTO = {
      id: this.user.id,
      senhaAtual: this.passwordData.currentPassword,
      novaSenha: this.passwordData.newPassword
    };

    try {
      const updatedUser = await firstValueFrom(this.usuarioService.changePassword(changePasswordDTO));
      this.user = updatedUser;
      localStorage.setItem('current_user', JSON.stringify(updatedUser));
      
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      this.passwordStrength = '';
      this.passwordsMismatch = false;
      this.isChangingPassword = false;
      
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Senha alterada com sucesso!'
      });
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao alterar senha: ' + (error.message || 'Erro desconhecido')
      });
    } finally {
      this.changingPassword = false;
    }
  }

  getMarcacoesByEstado(estado: string): number {
    return this.marcacoes.filter(m => m.estado === estado).length;
  }

  toggleAppointmentDetails(marcacao: PedidoMarcacaoDTO): void {
    this.expandedAppointments[marcacao.id] = !this.expandedAppointments[marcacao.id];
  }

  isAppointmentExpanded(marcacao: PedidoMarcacaoDTO): boolean {
    return this.expandedAppointments[marcacao.id] || false;
  }

  newAppointment(): void {
    this.messageService.add({ severity: 'info', summary: 'Informação', detail: 'Funcionalidade de nova marcação' });
  }

  formatDate(date: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR');
  }

  formatDateTime(date: string | Date): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('pt-BR');
  }

  formatTimeOrDateTime(value: string): string {
    if (!value) return '';
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
      return value.substring(0,5);
    }
    return this.formatDateTime(value);
  }

  getEstadoLabel(estado: string): string {
    const estadoMap: { [key: string]: string } = {
      'PEDIDO': 'Pedido',
      'AGENDADO': 'Agendado',
      'Realizado': 'Realizado',
      'CANCELADO': 'Cancelado'
    };
    return estadoMap[estado] || estado;
  }

  getEstadoClass(estado: string): string {
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'pedido') return 'status-pending';
    if (estadoLower === 'agendado' ) return 'status-pending';
    if (estadoLower === 'realizado') return 'status-confirmed';
    if (estadoLower === 'rejeitado' || estadoLower === 'cancelado') return 'status-canceled';
    return 'status-pending';
  }

  gerarPdfMarcacao(marcacao: PedidoMarcacaoDTO): void {
    this.pdfGenerator.generatePedidoMarcacaoPdf(marcacao);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Por favor, selecione apenas arquivos de imagem'
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'A imagem deve ter no máximo 5MB'
        });
        return;
      }

      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  getCurrentPhotoUrl(): string {
    if (this.previewUrl) {
      return this.previewUrl;
    }
    if (this.user?.fotografia) {
      return 'https://localhost:7273' + (this.user.fotografia.startsWith('/') ? this.user.fotografia : `/Uploads/${this.user.fotografia}`);
    }
    return '';
  }

  openFileSelector(): void {
    const fileInput = document.getElementById('photoUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}