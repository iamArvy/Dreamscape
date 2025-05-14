import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReplyService } from './reply.service';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';

@Controller()
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @MessagePattern('createReply')
  create(@Payload() createReplyDto: CreateReplyDto) {
    return this.replyService.create(createReplyDto);
  }

  @MessagePattern('findAllReply')
  findAll() {
    return this.replyService.findAll();
  }

  @MessagePattern('findOneReply')
  findOne(@Payload() id: number) {
    return this.replyService.findOne(id);
  }

  @MessagePattern('updateReply')
  update(@Payload() updateReplyDto: UpdateReplyDto) {
    return this.replyService.update(updateReplyDto.id, updateReplyDto);
  }

  @MessagePattern('removeReply')
  remove(@Payload() id: number) {
    return this.replyService.remove(id);
  }
}
