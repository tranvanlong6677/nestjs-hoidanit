import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { isEmpty } from 'class-validator';

@Injectable()
export class PermissionsService {
  constructor(@InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const newDate = new Date()
    const allPermission = await this.findAll()
    let checkDuplicate = false
    allPermission.forEach(async (item: any) => {
      if (createPermissionDto.apiPath === item.apiPath && createPermissionDto.method === item.method) {
        checkDuplicate = true
      }

    })
    if (checkDuplicate) {
      throw new BadRequestException("API đã tồn tại trong permission")
    }
    const result = await this.permissionModel.create({
      ...createPermissionDto, createdBy: {
        _id: user._id,
        email: user.email
      },
      createdAt: newDate
    })

    return {
      _id: result._id,
      createdAt: newDate
    }

  }

  async findAll() {
    const result = await this.permissionModel.find({})
    return result;
  }

  async fetchAllPaginate(limit: string, currentPage: string, qs: string) {
    const { filter, population, projection } = aqp(qs);
    let { sort } = aqp(qs)
    const defaultLimit = +limit ? +limit : 10
    const offset = (+currentPage - 1) * defaultLimit
    delete filter.current;
    delete filter.pageSize;


    const totalItems = (await this.permissionModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultLimit)
    if (isEmpty(sort)) {
      // @ts-ignore: Unreachable code error
      sort = "-updatedAt"
    }
    const result = await this.permissionModel.find(filter)
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
    return await this.permissionModel.findOne({ _id: id })
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    console.log(updatePermissionDto)
    const newDate = new Date()
    return await this.permissionModel.updateOne({ _id: id }, {
      ...updatePermissionDto, updatedAt: newDate, updatedBy: {
        _id: user._id,
        email: user.email
      }
    })
  }

  async remove(id: string, user: IUser) {
    await this.permissionModel.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return await this.permissionModel.softDelete({ _id: id })
  }
}
