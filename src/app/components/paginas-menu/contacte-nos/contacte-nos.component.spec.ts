import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContacteNosComponent } from './contacte-nos.component';

describe('ContacteNosComponent', () => {
  let component: ContacteNosComponent;
  let fixture: ComponentFixture<ContacteNosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContacteNosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContacteNosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
