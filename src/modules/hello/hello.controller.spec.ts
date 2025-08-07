// src/modules/hello/hello.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

describe('HelloController', () => {
  let controller: HelloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HelloController],
      providers: [HelloService],
    }).compile();

    controller = module.get<HelloController>(HelloController);
  });

  it('deve retornar "Hello World do backend!"', () => {
    expect(controller.getHello()).toBe('Hello World do backend!');
  });
});
