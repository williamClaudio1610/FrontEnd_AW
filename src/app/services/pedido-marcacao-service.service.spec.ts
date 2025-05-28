import { TestBed } from '@angular/core/testing';

import { PedidoMarcacaoServiceService } from './pedido-marcacao-service.service';

describe('PedidoMarcacaoServiceService', () => {
  let service: PedidoMarcacaoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoMarcacaoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
