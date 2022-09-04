import type {Message} from '@google-cloud/pubsub'
import express, {Request, Response, Router} from 'express'

import {initHttpHandlerRoutes} from "./initHttpHandlerRoutes";
import {PubSubEmulator} from "./PubSubEmulator";
import {complement} from "ramda";

type PubSubPullHandler = (message: Message) => Promise<unknown>;
type PubSubPushHandler = (request: Request, response: Response) => Promise<unknown>;
type HttpHandler = (request: Request, response: Response) => Promise<unknown>;

export interface PubSubPullHandlerConfig {
    id: string
    topic: string,
    handler: PubSubPullHandler
}

export interface PubSubPushHandlerConfig {
    id: string
    topic: string,
    filter: (message: Message) => boolean
    handler: PubSubPushHandler
}

export interface HttpHandlerConfig {
    method: 'GET' | 'POST'
    path: string
    handler: HttpHandler
}

interface ServerConfig {
    httpPort: number,
    pubsubPort: number,
    handlerConfigs: (PubSubPullHandlerConfig | PubSubPushHandlerConfig | HttpHandlerConfig)[]
}

export function isHttpHandlerConfig(config: HttpHandlerConfig | PubSubPullHandlerConfig | PubSubPushHandlerConfig): config is HttpHandlerConfig {
    const hasMethod = Boolean((config as HttpHandlerConfig).method)
    const hasPath = Boolean((config as HttpHandlerConfig).path)

    return hasMethod && hasPath
}

export async function startServer(serverConfig: ServerConfig): Promise<void> {
    const { httpPort = 5001, pubsubPort = 8085, handlerConfigs = [] } = serverConfig;

    const httpHandlerRouter = initHttpHandlerRoutes(handlerConfigs.filter(isHttpHandlerConfig))

    const app = express()

    app.use(httpHandlerRouter)

    const pubSubEmulator = new PubSubEmulator({
        port: pubsubPort,
        killExistingProcessOnPort: true
    })

    pubSubEmulator.on('emulatorChildProcessStderr', (msg) => console.log('emulatorErr: ', msg))
    pubSubEmulator.on('emulatorChildProcessStdout', (msg) => console.log('emulatorOut: ', msg))

    await pubSubEmulator.registerHandlers(handlerConfigs.filter(complement(isHttpHandlerConfig)))

    app.listen(httpPort, () => {
        console.log(`Http server listening on port ${httpPort}`)
    })
}
