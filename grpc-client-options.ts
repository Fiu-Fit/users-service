import { DEFAULT_PROTO_PATH } from '@fiu-fit/common';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { USER_PACKAGE_NAME } from './src/modules/user/interfaces/user.pb';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options:   {
    package:   [USER_PACKAGE_NAME, 'auth'],
    protoPath: [
      `${DEFAULT_PROTO_PATH}/user.proto`,
      `${DEFAULT_PROTO_PATH}/auth.proto`,
    ],
  },
};
