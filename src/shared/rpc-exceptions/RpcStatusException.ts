import { RpcException } from '@nestjs/microservices';

export class RpcStatusException extends RpcException {
  constructor(message: string, code: number) {
    super({
      code: code,
      message,
    });
  }
}
