import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { PedidoMarcacaoDTO } from '../models/pedido-marcacao';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  constructor() { }

  /**
   * Gera um PDF com os dados da marcação e seus atos clínicos
   * @param pedido PedidoMarcacaoDTO
   */
  generatePedidoMarcacaoPdf(pedido: PedidoMarcacaoDTO): void {
    const doc = new jsPDF();
    let y = 15;

    // Título
    doc.setFontSize(18);
    doc.text('Fatura de Marcação', 105, y, { align: 'center' });
    y += 10;
    doc.setFontSize(12);
    doc.text(`ID da Marcação: ${pedido.id}`, 15, y);
    y += 7;
    doc.text(`Usuário ID: ${pedido.userId}`, 15, y);
    y += 7;
    doc.text(`Data Solicitação: ${pedido.dataSolicitacao}`, 15, y);
    y += 7;
    doc.text(`Período: ${pedido.dataInicio} até ${pedido.dataFim}`, 15, y);
    y += 7;
    doc.text(`Estado: ${pedido.estado}`, 15, y);
    y += 7;
    if (pedido.observacoes) {
      doc.text(`Observações: ${pedido.observacoes}`, 15, y);
      y += 7;
    }

    // Atos Clínicos
    doc.setFontSize(14);
    doc.text('Atos Clínicos:', 15, y);
    y += 8;
    doc.setFontSize(11);
    if (pedido.actosClinicos && pedido.actosClinicos.length > 0) {
      pedido.actosClinicos.forEach((acto, idx) => {
        doc.text(`Ato #${idx + 1}`, 15, y);
        y += 6;
        doc.text(`- Tipo: ${acto.tipoDeConsultaExame?.nome || acto.tipoDeConsultaExameId}`, 20, y);
        y += 5;
        doc.text(`- Subsistema: ${acto.subsistemaSaude?.nome || acto.subsistemaSaudeId}`, 20, y);
        y += 5;
        if (acto.dataHora) {
          doc.text(`- Data/Hora: ${acto.dataHora}`, 20, y);
          y += 5;
        }
        if (acto.profissional) {
          doc.text(`- Profissional: ${acto.profissional.nome}`, 20, y);
          y += 5;
        }
        y += 2;
        if (y > 270) {
          doc.addPage();
          y = 15;
        }
      });
    } else {
      doc.text('Nenhum ato clínico registrado.', 20, y);
      y += 6;
    }

    // Rodapé
    doc.setFontSize(10);
    doc.text('Documento gerado automaticamente.', 15, 285);

    doc.save(`fatura-marcacao-${pedido.id}.pdf`);
  }
}

