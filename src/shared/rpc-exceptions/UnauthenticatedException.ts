import { status } from '@grpc/grpc-js';
import { RpcStatusException } from './RpcStatusException';

export class UnauthorizedException extends RpcStatusException {
  constructor(message: string) {
    super(message, status.UNAUTHENTICATED);
  }
}
