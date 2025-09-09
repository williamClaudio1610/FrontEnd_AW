import { Component, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pagina-inicial',
  standalone: false,
  templateUrl: './pagina-inicial.component.html',
  styleUrl: './pagina-inicial.component.css',
  providers: [MessageService]
})
export class PaginaInicialComponent implements OnInit, AfterViewInit {
  // Imagens médicas para o carousel
  carouselImages: string[] = [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1950&q=80',
  ];

  email: string = '';

  services = [
    {
      icon: 'pi pi-user-md',
      title: 'Médicos Especialistas',
      desc: 'Equipe de médicos altamente qualificados e experientes para cuidar da sua saúde.',
    },
    {
      icon: 'pi pi-heart',
      title: 'Cuidados Personalizados',
      desc: 'Atendimento personalizado e humanizado, focado no bem-estar do paciente.',
    },
    {
      icon: 'pi pi-calendar-plus',
      title: 'Agendamento Online',
      desc: 'Marque suas consultas de forma rápida e conveniente através do nosso sistema.',
    },
    {
      icon: 'pi pi-shield',
      title: 'Tecnologia Avançada',
      desc: 'Utilizamos equipamentos modernos e tecnologia de ponta para diagnósticos precisos.',
    }
  ];

  // Estatísticas que queremos mostrar
  stats = [
    { key: 'pacientes', label: 'Pacientes satisfeitos', value: 5120 },
    { key: 'categorias', label: 'Especialidades médicas', value: 26 },
    { key: 'doutor', label: 'Médicos certificados', value: 53 },
    { key: 'experiencia', label: 'Anos de experiência', value: 10 },
  ];

  servicos = [
    {
    titulo: 'Consulta de Rotina',
    descricao: 'Avaliação médica completa para manter sua saúde em dia com exames preventivos.',
    imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80',
    alt: 'Consulta médica de rotina'
    },
    {
      titulo: 'Exames Laboratoriais',
      descricao: 'Exames precisos e rápidos para diagnóstico e acompanhamento da sua saúde.',
      imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80',
      alt: 'Exames laboratoriais'
    },
    {
      titulo: 'Vacinação',
      descricao: 'Programa completo de vacinação para todas as idades e necessidades.',
      imagem: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',
      alt: 'Serviço de vacinação'
    },
    {
      titulo: 'Exame de Sangue',
      descricao: 'Especialistas em saúde cardiovascular com equipamentos de última geração.',
      imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80',
      alt: 'Especialidade de cardiologia'
    },
    {
      titulo: 'Oftalmologia',
      descricao: 'Cuidados especializados para crianças com ambiente acolhedor e seguro.',
      imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80',
      alt: 'Especialidade de pediatria'
    },
    {
      titulo: 'Cardiologia',
      descricao: 'Atenção integral à saúde da mulher com profissionais especializados.',
      imagem: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80',
      alt: 'Especialidade de ginecologia'
    }
  ]

  // Contadores animados
  animatedCounts: { [key: string]: number } = {
    pacientes: 0,
    categorias: 0,
    doutor: 0,
    experiencia: 0,
  };

  constructor(private cd: ChangeDetectorRef, private messageService: MessageService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Quando a secção de stats entrar no ecrã, anima os valores
    const statsSection = document.querySelector('.stats-section')!;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          this.animateStats();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(statsSection);
  }

  animateStats() {
    for (const stat of this.stats) {
      const increment = stat.value / 100;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(interval);
        }
        this.animatedCounts[stat.key] = Math.round(current);
        this.cd.markForCheck();
      }, 10);
    }
  }
}