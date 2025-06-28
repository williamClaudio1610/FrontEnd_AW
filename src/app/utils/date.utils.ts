export class DateUtils {
  /**
   * Converte um Date para DateOnly (YYYY-MM-DD)
   */
  static toDateOnly(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /**
   * Converte um DateOnly (YYYY-MM-DD) para Date
   */
  static fromDateOnly(dateOnly: Date): Date {
    return new Date(dateOnly.getFullYear(), dateOnly.getMonth(), dateOnly.getDate());
  }

  /**
   * Formata uma data no formato YYYY-MM-DD
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Converte uma string no formato YYYY-MM-DD para Date
   */
  static parseDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
}
