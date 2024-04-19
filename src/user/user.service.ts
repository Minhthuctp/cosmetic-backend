import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserDetail } from './dto/userDetail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createUser(user: UserDetail) {
    try {
      const newUser = await this.userModel.create(user);
      return newUser;
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.userModel.findById(id);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async updateUser() {}
}
