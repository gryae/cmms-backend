import { PushController } from "./push.controller";
import { PushService } from "./push.service";
import { Module } from '@nestjs/common';


@Module({
    controllers: [PushController],
    providers:[PushService],
    exports:[PushService],
})
export class PushModule {}