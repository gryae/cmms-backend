import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailer: MailerService) {}

 async sendWorkOrderCreated(data: {
    to: string[];
    title: string;
    priority: string;
    creator: string;
    asset?: string;
    dueDate?: string;
    workOrderId: string;
  }) {
    const link = `${process.env.FRONTEND_URL}/work-orders/${data.workOrderId}`;

    await this.mailer.sendMail({
      to: data.to,
      subject: `🛠 Work Order Created: ${data.title}`,
      template: 'work-order-created',
      context: {
        title: data.title,
        priority: data.priority,
        creator: data.creator,
        asset: data.asset,
        dueDate: data.dueDate,
        link,
      },
    });
  }

  async sendWorkOrderAssigned(data: {
     to: string[];
  title: string;
  technician: string;
  creatorEmail: string;
  asset?: string;
  dueDate?: string;
  workOrderId: string;
  }) {
    const appurl = `${process.env.FRONTEND_URL}/work-orders/${data.workOrderId}`;

    return this.mailer.sendMail({
      to: data.to,
      subject: `Work Order Assigned - ${data.title}`,
      template: 'work-order-assigned',
       context: {
        title: data.title,
        asset: data.asset,
        dueDate: data.dueDate,
        appurl,
        creatorEmail: data.creatorEmail,
        technician:data.technician,
        workOrderId:data.workOrderId,
       },
    });
  }

async sendWorkOrderDone(data: {
  to: string[];
  title: string;
  technician?: string;
  creator: string;
  asset?: string;
  workOrderId: string;
}) {
  const link = `${process.env.FRONTEND_URL}/work-orders/${data.workOrderId}`;

  return this.mailer.sendMail({
    to: data.to,
    subject: `✅ Work Order Completed: ${data.title}`,
    template: 'work-order-done',
    context: {
      title: data.title,
      technician: data.technician,
      creator: data.creator,
      asset: data.asset,
      link,
    },
  });
}

}
