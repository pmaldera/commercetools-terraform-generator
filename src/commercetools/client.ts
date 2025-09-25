import { ApiRoot, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
  ClientBuilder,
  type AuthMiddlewareOptions,
  type HttpMiddlewareOptions,
} from '@commercetools/ts-client';


export function createApiRoot(authOptions: AuthMiddlewareOptions, httpOptions: HttpMiddlewareOptions, enableLogs: boolean = false): ApiRoot {
    let ctpClient:ClientBuilder = new ClientBuilder()
    .withClientCredentialsFlow(authOptions)
    .withHttpMiddleware(httpOptions)

    if(enableLogs) ctpClient = ctpClient.withLoggerMiddleware()

    return createApiBuilderFromCtpClient(ctpClient.build())
}