import { Injectable } from "@nestjs/common";
import * as webPush from "web-push";

@Injectable()
export class PushService {
  constructor() {
    webPush.setVapidDetails(
      'mailto:admin@maintina.com',
      process.env.VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!,
    );
}
    async sendNotification(subscription: webPush.PushSubscription, payload: {
        title: string;
        body: string;
        url?: string;
    }) {
    return webPush.sendNotification(subscription, JSON.stringify(payload));
    }
}