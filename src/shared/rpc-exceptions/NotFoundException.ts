import { status } from '@grpc/grpc-js';
import { RpcStatusException } from './RpcStatusException';

export class NotFoundException extends RpcStatusException {
  constructor(message: string) {
    super(message, status.NOT_FOUND);
  }
}
