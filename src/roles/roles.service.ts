import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUser } from 'src/users/users.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Role, RoleDocument } from './schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>) { }
  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const newDate = new Date()
    const allRole = await this.findAll()
    let checkDuplicateName = false
    allRole.forEach((item: any) => {
      if (item.name === createRoleDto.name) {
        checkDuplicateName = true
      }
    })
    if (checkDuplicateName) {
      throw new BadRequestException("Trùng tên role đã tạo")
    } else {
      return await this.roleModel.create({
        ...createRoleDto, createdAt: newDate, createdBy: {
          _id: user._id,
          email: user.email
        }
      })
    }

  }

  async findAll() {
    return await this.roleModel.find({})
  }

  async fetchRolePaginate(limit: string, currentPage: string, qs: string) {
    const { filter, population, projection } = aqp(qs);
    let { sort } = aqp(qs)
    const defaultLimit = +limit ? +limit : 10
    const offset = (+currentPage - 1) * defaultLimit
    delete filter.current;
    delete filter.pageSize;


    const totalItems = (await this.roleModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.roleModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // @ts-ignore: Unreachable code error
      .sort(sort)
      .populate(population)
      .select(projection as any)
      .exec()
    return {
      meta: {
        current: +currentPage, //trang hiện tại
        pageSize: defaultLimit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  async findOne(id: string) {
    return await this.roleModel.findOne({ _id: id })
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const newDate = new Date()
    const allRole = await this.findAll()
    let checkDuplicateName = false
    allRole.forEach((item: any) => {
      if (item.name === updateRoleDto.name && item._id.toString() !== id) {
        checkDuplicateName = true
      }
    })

    if (checkDuplicateName) {
      throw new BadRequestException("Trùng tên role đã tạo")
    } else {
      return await this.roleModel.updateOne({ _id: id }, {
        ...updateRoleDto, updatedAt: newDate, updatedBy: {
          _id: user._id,
          email: user.email
        }
      })
    }
  }

  async remove(id: string, user: IUser) {
    await this.roleModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return await this.roleModel.softDelete({ _id: id })
  }
}
