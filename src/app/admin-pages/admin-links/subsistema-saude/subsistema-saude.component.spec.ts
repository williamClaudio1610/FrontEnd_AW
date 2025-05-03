import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsistemaSaudeComponent } from './subsistema-saude.component';

describe('SubsistemaSaudeComponent', () => {
  let component: SubsistemaSaudeComponent;
  let fixture: ComponentFixture<SubsistemaSaudeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubsistemaSaudeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubsistemaSaudeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
