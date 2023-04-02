import { ClientOptions, Transport } from '@nestjs/microservices';

export const DefaultProtoPath = './src/modules';

export const grpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options:   {
    package:   ['auth', 'user'],
    protoPath: [
      `${DefaultProtoPath}/user/user.proto`,
      `${DefaultProtoPath}/auth/auth.proto`,
    ],
  },
};
