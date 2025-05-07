import { Component, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-newsletter-faq-section',
  standalone: false,
  templateUrl: './newsletter-faq-section.component.html',
  styleUrl: './newsletter-faq-section.component.css',
  providers: [MessageService]
})
export class NewsletterFaqSectionComponent {

  email: string = '';

  constructor(private messageService: MessageService) {}
  onSubscribe() {
    if (this.email) {
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Subscrito com sucesso!' });
      this.email = '';
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Por favor, insira um e-mail.' });
    }
  }


}
