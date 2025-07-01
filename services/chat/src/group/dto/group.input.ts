import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupData {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateGroupData extends PartialType(CreateGroupData) {
  id: string;
}
export class CreateGroupInput {
  user_id: string;
  data: CreateGroupData;
}

export class UserGroupInput {
  id: string;
  user_id: string;
}

export class UserDataInput<T> extends UserGroupInput {
  data: T;
}

export class AddMembersInput extends UserGroupInput {
  users: string[];
}

export class UserGroupParticipantInput extends UserGroupInput {
  participant_id: string;
}
