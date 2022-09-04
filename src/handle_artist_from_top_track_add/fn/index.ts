import type {Response} from 'express'
export async function main (
    incomingMessage: {
        body: {
            message: {
                data: string;
                attributes: Record<string, unknown>
            }
        }
    },
    res: Response
): Promise<unknown> {
    console.log('data', Buffer.from(incomingMessage.body.message.data, 'base64').toString())
    console.log('attrs', incomingMessage.body.message.attributes)
    return res.json({ success: true }) // need this!
    // return null <- this will timeout and retry due to no acking the message in a permanent loop!
}
