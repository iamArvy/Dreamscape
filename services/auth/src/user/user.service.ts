import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public = {
    id: true,
    email: true,
  };
  async create(email: string, password: string): Promise<UserDocument> {
    const user = new this.userModel({ email, password });
    return user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async find(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async findByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async updateUser(
    id: string,
    updates: Partial<User>,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updates, {
        new: true, // return the updated document
        runValidators: true, // ensure validations from the schema apply
      })
      .exec();
  }

  async updateByEmail(email: string, updates: Partial<User>): Promise<any> {
    return this.userModel.updateOne({ email }, { $set: updates }).exec();
  }

  async updatePassword(
    id: string,
    newPassword: string,
  ): Promise<UserDocument | null> {
    const user = await this.userModel.findById(id);
    if (!user) return null;

    user.password = newPassword;
    return user.save();
  }

  async updateRefreshToken(id: string, token: string | null) {
    return this.userModel
      .updateOne({ id }, { $set: { refresh_token: token } })
      .exec();
  }
}
