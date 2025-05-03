import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoDeConsultaExameComponent } from './tipo-de-consulta-exame.component';

describe('TipoDeConsultaExameComponent', () => {
  let component: TipoDeConsultaExameComponent;
  let fixture: ComponentFixture<TipoDeConsultaExameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipoDeConsultaExameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoDeConsultaExameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
