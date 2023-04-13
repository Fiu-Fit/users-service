import { DEFAULT_PROTO_PATH } from '@fiu-fit/common';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from './src/modules/auth/interfaces/auth.pb';
import { USER_PACKAGE_NAME } from './src/modules/user/interfaces/user.pb';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options:   {
    url:       process.env.USER_SERVICE_URL,
    package:   [USER_PACKAGE_NAME, AUTH_PACKAGE_NAME],
    protoPath: [
      `${DEFAULT_PROTO_PATH}/user.proto`,
      `${DEFAULT_PROTO_PATH}/auth.proto`,
    ],
  },
};
