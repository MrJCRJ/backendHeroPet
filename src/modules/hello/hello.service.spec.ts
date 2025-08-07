// src/modules/hello/hello.service.spec.ts

import { HelloService } from './hello.service';

describe('HelloService', () => {
  let service: HelloService;

  beforeEach(() => {
    service = new HelloService();
  });

  it('deve retornar "Hello World do backend!"', () => {
    expect(service.getHello()).toBe('Hello World do backend!');
  });
});
