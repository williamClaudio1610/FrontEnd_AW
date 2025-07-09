import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PedidoMarcacaoDTO } from '../models/pedido-marcacao';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  private readonly PRIMARY_COLOR = '#3498db';
  private readonly SECONDARY_COLOR = '#2c3e50';
  private readonly ACCENT_COLOR = '#e74c3c';
  private readonly LIGHT_BG = '#f8f9fa';
  
  constructor() { }

  generatePedidoMarcacaoPdf(pedido: PedidoMarcacaoDTO): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let y = margin;

    // Adicionar cabeçalho com gradiente
    this.drawHeader(doc, pageWidth, 'Fatura de Marcação');
    y += 25;

    // Informações principais com destaque
    doc.setFontSize(12);
    doc.setTextColor(this.SECONDARY_COLOR);
    doc.setFont('helvetica', 'bold');
    
    const infoConfig = [
      { label: 'ID da Marcação', value: pedido.id },
      { label: 'Usuário ID', value: pedido.userId },
      { label: 'Data Solicitação', value: pedido.dataSolicitacao },
      { label: 'Período', value: `${pedido.dataInicio} até ${pedido.dataFim}` },
      { label: 'Estado', value: pedido.estado },
      ...(pedido.observacoes ? [{ label: 'Observações', value: pedido.observacoes }] : [])
    ];

    infoConfig.forEach(item => {
      doc.setTextColor(this.SECONDARY_COLOR);
      doc.setFont('helvetica', 'bold');
      doc.text(`${item.label}:`, margin, y);
      
      doc.setTextColor(60);
      doc.setFont('helvetica', 'normal');
      doc.text(item.value.toString(), margin + doc.getTextWidth(item.label) + 5, y);
      
      y += 8;
    });

    y += 10;

    // Tabela de Atos Clínicos
    doc.setTextColor(this.SECONDARY_COLOR);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Atos Clínicos', margin, y);
    y += 10;

    if (pedido.actosClinicos && pedido.actosClinicos.length > 0) {
      const tableData = pedido.actosClinicos.map((acto, index) => [
        `#${index + 1}`,
        acto.tipoDeConsultaExame?.nome || acto.tipoDeConsultaExameId || 'N/A',
        acto.subsistemaSaude?.nome || acto.subsistemaSaudeId || 'N/A',
        acto.dataHora || acto.anoMesDia || 'N/A',
        acto.profissional?.nome || 'N/A'
      ]);

      autoTable(doc, {
        startY: y,
        head: [['#', 'Tipo', 'Subsistema', 'Data/Hora', 'Profissional']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: this.SECONDARY_COLOR,
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: this.LIGHT_BG
        },
        styles: {
          cellPadding: 3,
          fontSize: 10,
          valign: 'middle'
        },
        margin: { left: margin, right: margin }
      });
    } else {
      doc.setTextColor(this.ACCENT_COLOR);
      doc.setFont('helvetica', 'italic');
      doc.text('Nenhum ato clínico registrado', margin, y);
    }

    // Rodapé estilizado
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    doc.setTextColor(100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Documento gerado automaticamente - ' + new Date().toLocaleDateString(), 
             pageWidth - margin, footerY, { align: 'right' });

    // Adicionar logo (exemplo)
    // this.addLogo(doc, pageWidth, margin);
    
    doc.save(`fatura-marcacao-${pedido.id}.pdf`);
  }

  private drawHeader(doc: jsPDF, pageWidth: number, title: string): void {
    // Gradiente de fundo
    const gradient = doc.context2d.createLinearGradient(0, 0, pageWidth, 0);
    gradient.addColorStop(0, this.PRIMARY_COLOR);
    gradient.addColorStop(1, this.SECONDARY_COLOR);
    
    doc.setFillColor(this.PRIMARY_COLOR);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Texto do cabeçalho
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255);
    doc.text(title, pageWidth / 2, 25, { align: 'center' });
    
    // Elemento decorativo
    doc.setDrawColor(255);
    doc.setLineWidth(0.5);
    doc.line(50, 30, pageWidth - 50, 30);
  }

  // Exemplo de como adicionar uma logo
  private addLogo(doc: jsPDF, pageWidth: number, margin: number): void {
    // Para usar uma imagem real, você precisaria carregá-la via URL/base64
    const logo = {
      src: 'public/ChatGPT_logo.png', // Base64 da imagem
      width: 30,
      height: 30
    };
    
    doc.addImage(
      logo.src,
      'PNG',
      pageWidth - margin - logo.width,
      margin,
      logo.width,
      logo.height
    );
  }
}