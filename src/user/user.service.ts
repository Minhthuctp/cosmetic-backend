import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserDetail } from './dto/userDetail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createUser(user: UserDetail) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await this.userModel.create({
        ...user,
        hashPassword: hashedPassword,
      });
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

  async findOne(email: string) {
    return this.userModel.findOne({ email: email }).exec();
  }

  async updateUser() {}
}
