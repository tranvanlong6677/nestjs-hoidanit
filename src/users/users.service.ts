import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>) { }
  hashPassword = (password: string) => {
    var salt = genSaltSync(10);
    return hashSync(password, salt)
  }
  async create(createUserDto: CreateUserDto) {
    const result = await this.userModel.create({ email: createUserDto.email, password: this.hashPassword(createUserDto.password), name: createUserDto.name })
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

  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username });
  }
  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword)
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, {
      ...updateUserDto
    })
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Not valid'
    }
    return await this.userModel.softDelete({ _id: id });
  }
}
