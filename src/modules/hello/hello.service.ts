// src/modules/hello/hello.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloService {
  getHello(): string {
    return 'Hello World do backend!';
  }
}
