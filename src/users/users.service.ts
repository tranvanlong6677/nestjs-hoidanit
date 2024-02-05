import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { genSaltSync, hashSync } from 'bcryptjs'


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }
  hashPassword = (password: string) => {
    var salt = genSaltSync(10);
    return hashSync(password, salt)
  }
  async create(createUserDto: CreateUserDto) {
    const result = await this.userModel.create({ email: createUserDto.email, password: this.hashPassword(createUserDto.password), name: createUserDto.name })
    console.log(createUserDto)

    return result;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not valid'
    }
    return this.userModel.findOne({ _id: id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
