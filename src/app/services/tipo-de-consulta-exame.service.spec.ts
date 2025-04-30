import { TestBed } from '@angular/core/testing';

import { TipoDeConsultaExameService } from './tipo-de-consulta-exame.service';

describe('TipoDeConsultaExameService', () => {
  let service: TipoDeConsultaExameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoDeConsultaExameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
