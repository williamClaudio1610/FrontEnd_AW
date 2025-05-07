import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipaComponent } from './equipa.component';

describe('EquipaComponent', () => {
  let component: EquipaComponent;
  let fixture: ComponentFixture<EquipaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
