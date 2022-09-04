import {Router} from "express";

import {HttpHandlerConfig, PubSubPullHandlerConfig} from "./server";

export function initHttpHandlerRoutes (handlerConfigs: HttpHandlerConfig[]): Router {
    const router = Router()
    for (const config of handlerConfigs) {
        const {
            method,
            path,
            handler
        } = config
        switch (method) {
            case "GET":
                router.get(path, handler)
                break
            case "POST":
                router.post(path, handler)
                break
        }
    }
    return router
}
