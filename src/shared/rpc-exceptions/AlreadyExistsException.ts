import { status } from '@grpc/grpc-js';
import { RpcStatusException } from './RpcStatusException';

export class AlreadyExistsException extends RpcStatusException {
  constructor(message: string) {
    super(message, status.ALREADY_EXISTS);
  }
}
