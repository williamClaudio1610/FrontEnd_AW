import { Component, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-pagina-inicial',
  standalone: false,
  templateUrl: './pagina-inicial.component.html',
  styleUrl: './pagina-inicial.component.css'
})
export class PaginaInicialComponent implements OnInit, AfterViewInit {
  // Imagens públicas para o carousel
  carouselImages: string[] = [
    'https://source.unsplash.com/collection/190727/800x600',
    'https://source.unsplash.com/collection/190728/800x600',
    'https://source.unsplash.com/collection/190729/800x600',
  ];

  services = [
    {
      icon: 'fa fa-hospital-alt',
      title: 'General Practitioners',
      desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
    },
    {
      icon: 'fa fa-baby',
      title: 'Pregnancy Support',
      desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
    },
    {
      icon: 'fa fa-apple-alt',
      title: 'Nutritional Support',
      desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
    },
    {
      icon: 'fa fa-pills',
      title: 'Pharmaceutical Care',
      desc: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
    }
  ];

  // Estatísticas que queremos mostrar
  stats = [
    { key: 'pacientes', label: 'Pacientes satisfeitos', value: 5120 },
    { key: 'categorias', label: 'Total Branches', value: 26 },
    { key: 'doutor', label: 'Doutores certificados', value: 53 },
    { key: 'experiencia', label: 'Anos de experiencia', value: 10 },
  ];

  // Contadores animados
  animatedCounts: { [key: string]: number } = {
    pacientes: 0,
    categorias: 0,
    doutor: 0,
    experiencia: 0,
  };

  constructor(private cd: ChangeDetectorRef) {}

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