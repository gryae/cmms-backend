import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';


@Controller('push')
@UseGuards(JwtAuthGuard)
export class PushController {
  constructor(private prisma: PrismaService) {}

  @Post('subscribe')
  async subscribe(
    @Req() req,
    @Body('subscription') subscription: any){
        //console.log('REQ USER = ',req.user);
        return this.prisma.pushSubscription.upsert({
            where: {
                endpoint: subscription.endpoint,
            },
            update:{
                keys: subscription.keys,
            },
            create:{
            endpoint: subscription.endpoint,
            keys: subscription.keys,
            user: {
                connect: {id: req.user.userId}
            }
            }
        });
    }
}
    