import { status } from '@grpc/grpc-js';
import { RpcStatusException } from './RpcStatusException';

export class InvalidArgumentException extends RpcStatusException {
  constructor(message: string) {
    super(message, status.INVALID_ARGUMENT);
  }
}
