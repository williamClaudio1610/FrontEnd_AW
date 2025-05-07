import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsletterFaqSectionComponent } from './newsletter-faq-section.component';

describe('NewsletterFaqSectionComponent', () => {
  let component: NewsletterFaqSectionComponent;
  let fixture: ComponentFixture<NewsletterFaqSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewsletterFaqSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsletterFaqSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
