import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultasExamesComponent } from './consultas-exames.component';

describe('ConsultasExamesComponent', () => {
  let component: ConsultasExamesComponent;
  let fixture: ComponentFixture<ConsultasExamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultasExamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultasExamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
