import { join } from 'node:path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import type { EmulatorControllerClient } from './generated/android/emulation/control/EmulatorController';
import type { ProtoGrpcType } from './generated/emulator_controller';

export type { EmulatorControllerClient };

let cachedProto: ProtoGrpcType | undefined;

function loadProto(): ProtoGrpcType {
  if (!cachedProto) {
    // Mesmas opções usadas no `gen:proto`, senão os tipos gerados mentem.
    const definition = protoLoader.loadSync(join(__dirname, 'proto', 'emulator_controller.proto'), {
      longs: Number,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    cachedProto = grpc.loadPackageDefinition(definition) as unknown as ProtoGrpcType;
  }
  return cachedProto;
}

// `-grpc-use-token` exige o token em toda chamada. Canal inseguro não aceita call credentials
// no grpc-js, então o header vai por interceptor.
function bearerInterceptor(token: string): grpc.Interceptor {
  return (options, nextCall) =>
    new grpc.InterceptingCall(nextCall(options), {
      start(metadata, listener, next) {
        metadata.set('authorization', `Bearer ${token}`);
        next(metadata, listener);
      },
    });
}

export function createEmulatorClient(
  port: number,
  token: string | undefined,
): EmulatorControllerClient {
  const { EmulatorController } = loadProto().android.emulation.control;
  return new EmulatorController(`localhost:${port}`, grpc.credentials.createInsecure(), {
    interceptors: token ? [bearerInterceptor(token)] : [],
    'grpc.max_receive_message_length': -1,
  });
}

export function deadline(timeoutMs = 5000): grpc.CallOptions {
  return { deadline: Date.now() + timeoutMs };
}

/** Adapta uma chamada unária de callback para Promise. */
export function call<TResponse>(
  invoke: (callback: grpc.requestCallback<TResponse>) => grpc.ClientUnaryCall,
): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    invoke((error, response) => {
      if (error) reject(error);
      else if (response === undefined) reject(new Error('Empty gRPC response'));
      else resolve(response);
    });
  });
}
