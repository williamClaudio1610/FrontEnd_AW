export class SubsistemaSaude {
}

export interface SubsistemaSaudeDTO {
    id: number;
    nome: string;
  }
  
  export interface CreateSubsistemaSaudeDTO {
    nome: string;
  }
  
  export interface UpdateSubsistemaSaudeDTO {
    id: number;
    nome?: string;
    descricao?: string;
  }
  
  export interface SubsistemaSaude {
    id: number;
    nome: string;
  }