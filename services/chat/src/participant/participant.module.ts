import { Global, Module } from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { Participant, ParticipantSchema } from './participant.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Participant.name, schema: ParticipantSchema },
    ]),
  ],
  providers: [ParticipantService],
  exports: [ParticipantService],
})
@Global()
export class ParticipantModule {}
