import { Component, OnInit } from '@angular/core';
import { Usuario, UpdateUserDTO } from '../../../models/usuario';
import { CreateUserDTO } from '../../../models/usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { PedidoMarcacaoServiceService } from '../../../services/pedido-marcacao-service.service';
import { PedidoMarcacaoDTO } from '../../../models/pedido-marcacao';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { PdfGeneratorService } from '../../../services/pdf-generator.service';

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
    telemovel: '',
    morada: '',
    dataNascimento: '',
    genero: ''
  };
  selectedFile: File | undefined = undefined;
  previewUrl: string | null = null;
  originalUserData: UpdateUserDTO | null = null;
  isEditing = false;
  isChangingPassword = false;
  marcacoes: PedidoMarcacaoDTO[] = [];
  expandedAppointments: { [key: number]: boolean } = {};
  loading = false;
  saving = false;
  changingPassword = false;

  // Campos para alteração de senha
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

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
    // Carregar dados do usuário logado
    this.user = this.usuarioService.getCurrentUser();
    if (this.user) {
      this.editUser = {
        id: this.user.id,
        nome: this.user.nome,
        email: this.user.email,
        telemovel: this.user.telemovel || '',
        morada: this.user.morada || '',
        dataNascimento: this.user.dataNascimento || '',
        genero: this.user.genero || '',
        perfil: this.user.perfil
      };
      // Salvar dados originais para comparação
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

  toggleEdit(): void {
    if (this.isEditing) {
      // Verificar se há mudanças antes de cancelar
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
      // Limpar campos de senha ao cancelar
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    }
  }

  cancelEdit(): void {
    this.loadUserData();
    this.isEditing = false;
    this.selectedFile = undefined;
    this.previewUrl = null;
  }

  cancelPasswordChange(): void {
    this.isChangingPassword = false;
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }

  hasChanges(): boolean {
    if (!this.originalUserData) return false;
    
    return (
      this.editUser.nome !== this.originalUserData.nome ||
      this.editUser.email !== this.originalUserData.email ||
      this.editUser.telemovel !== this.originalUserData.telemovel ||
      this.editUser.morada !== this.originalUserData.morada ||
      this.editUser.dataNascimento !== this.originalUserData.dataNascimento ||
      this.editUser.genero !== this.originalUserData.genero ||
      this.selectedFile !== undefined
    );
  }

  onSubmit(): void {
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
      
      // Obter a senha atual do serviço
      const currentPassword = this.usuarioService.getCurrentPassword();
      
      if (!currentPassword) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Senha atual não encontrada. Faça login novamente.'
        });
        this.saving = false;
        return;
      }

      // Preparar dados para atualização
      const updateData: UpdateUserDTO = {
        id: this.user!.id,
        nome: this.editUser.nome.trim(),
        email: this.editUser.email.trim(),
        telemovel: this.editUser.telemovel.trim(),
        morada: this.editUser.morada.trim(),
        genero: this.editUser.genero,
        dataNascimento: this.formatDateForBackend(this.editUser.dataNascimento ?? ''),
        fotografia: this.selectedFile,
        perfil: this.user!.perfil,
        senhaHash: currentPassword // Usar a senha atual armazenada
      };

      this.usuarioService.updateUsuario(updateData).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Perfil atualizado com sucesso!'
          });
          this.isEditing = false;
          this.saving = false;
          this.selectedFile = undefined;
          this.previewUrl = null;
          // Atualizar dados originais após sucesso
          this.loadUserData();
        },
        error: (error) => {
          console.error('Erro ao atualizar perfil:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.message || 'Erro ao atualizar perfil'
          });
          this.saving = false;
        }
      });
    }
  }

  // Método auxiliar para formatar data para o backend
  formatDateForBackend(date: string | Date): string {
    if (!date) return '';
    
    let dateObj: Date;
    if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      dateObj = date;
    }
    
    // Formato YYYY-MM-DD para o backend
    return dateObj.toISOString().split('T')[0];
  }

  onSubmitPassword(): void {
    // Validações para alteração de senha
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

    if (this.passwordData.newPassword.length < 6) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Nova senha deve ter pelo menos 6 caracteres'
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

    // Verificar se a senha atual digitada confere com a senha armazenada
    const storedPassword = this.usuarioService.getCurrentPassword();
    if (this.passwordData.currentPassword !== storedPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Senha atual incorreta'
      });
      return;
    }

    this.changingPassword = true;

    // Usar o método alterarSenha que já inclui todos os campos necessários
    this.usuarioService.alterarSenha(this.passwordData.newPassword).subscribe({
      next: (updatedUser) => {
        this.changingPassword = false;
        this.isChangingPassword = false;
        
        // Atualizar a senha armazenada no serviço
        localStorage.setItem('current_password', this.passwordData.newPassword);
        
        // Limpar campos de senha
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Senha alterada com sucesso!'
        });
      },
      error: (error) => {
        this.changingPassword = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao alterar senha: ' + (error.message || 'Erro desconhecido')
        });
      }
    });
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
    // Lógica para nova marcação
    this.messageService.add({ severity: 'info', summary: 'Informação', detail: 'Funcionalidade de nova marcação' });
  }

  // Métodos auxiliares para formatação
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

  // Exibe hora (HH:mm) se for só hora, ou data/hora se for datetime
  formatTimeOrDateTime(value: string): string {
    if (!value) return '';
    // Se for só hora (HH:mm ou HH:mm:ss)
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
      return value.substring(0,5); // HH:mm
    }
    // Se for data/hora completa
    return this.formatDateTime(value);
  }

  getEstadoLabel(estado: string): string {
    const estadoMap: { [key: string]: string } = {
      'PENDENTE': 'Pendente',
      'APROVADO': 'Aprovado',
      'REJEITADO': 'Rejeitado',
      'CANCELADO': 'Cancelado',
      'Pedido': 'Pedido',
      'Confirmada': 'Confirmada'
    };
    return estadoMap[estado] || estado;
  }

  getEstadoClass(estado: string): string {
    const estadoLower = estado.toLowerCase();
    if (estadoLower === 'pendente' || estadoLower === 'pedido') return 'status-pending';
    if (estadoLower === 'aprovado' || estadoLower === 'confirmada') return 'status-confirmed';
    if (estadoLower === 'rejeitado' || estadoLower === 'cancelado') return 'status-canceled';
    return 'status-pending';
  }

  gerarPdfMarcacao(marcacao: PedidoMarcacaoDTO): void {
    this.pdfGenerator.generatePedidoMarcacaoPdf(marcacao);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Por favor, selecione apenas arquivos de imagem'
        });
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'A imagem deve ter no máximo 5MB'
        });
        return;
      }

      this.selectedFile = file;
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = undefined;
    this.previewUrl = null;
  }

  getCurrentPhotoUrl(): string {
    if (this.previewUrl) {
      return this.previewUrl;
    }
    if (this.user?.fotografia) {
      return 'https://localhost:7273' + this.user.fotografia;
    }
    return ''; // Retorna string vazia para mostrar o ícone padrão
  }

  openFileSelector(): void {
    const fileInput = document.getElementById('photoUpload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}