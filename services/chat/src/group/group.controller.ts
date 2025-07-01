import { Controller } from '@nestjs/common';
// import { GrpcMethod } from '@nestjs/microservices';
// import { CreateGroupInput } from './dto';
import { GroupService } from './group.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AddMembersInput,
  CreateGroupInput,
  UpdateGroupData,
  UserDataInput,
  UserGroupInput,
  UserGroupParticipantInput,
} from './dto';

@Controller('group')
export class GroupController {
  constructor(private service: GroupService) {}

  @GrpcMethod('GroupService')
  createGroup({ user_id, data }: CreateGroupInput) {
    return this.service.create(user_id, data);
  }

  @GrpcMethod('GroupService')
  update({ user_id, id, data }: UserDataInput<UpdateGroupData>) {
    return this.service.update(id, user_id, data);
  }

  @GrpcMethod('GroupService')
  delete({ user_id, id }: UserGroupInput) {
    return this.service.delete(id, user_id);
  }

  // changePrivacy(){}
  // generateInviteLink() {}
  // acceptInviteRequest() {}
  // rejectInviteRequest() {}
  // joinWithLink() {}

  @GrpcMethod('GroupService')
  makeOwner({ id, user_id, participant_id }: UserGroupParticipantInput) {
    return this.service.makeOwner(id, user_id, participant_id);
  }

  @GrpcMethod('GroupService')
  async addMembers({ id, user_id, users }: AddMembersInput) {
    return this.service.addMembers(id, user_id, users);
  }

  @GrpcMethod('GroupService')
  getParticipants({ id, user_id }: UserGroupInput) {
    return this.service.getParticipants(id, user_id);
  }

  @GrpcMethod('GroupService')
  makeAdmin({ id, user_id, participant_id }: UserGroupParticipantInput) {
    return this.service.makeAdmin(id, user_id, participant_id);
  }

  @GrpcMethod('GroupService')
  removeAdmin({ id, user_id, participant_id }: UserGroupParticipantInput) {
    return this.service.makeAdmin(id, user_id, participant_id);
  }

  @GrpcMethod('GroupService')
  removeMember({ id, user_id, participant_id }: UserGroupParticipantInput) {
    return this.service.removeMember(id, user_id, participant_id);
  }

  @GrpcMethod('GroupService')
  leaveGroup({ id, user_id }: UserGroupInput) {
    return this.service.leave(id, user_id);
  }
}
