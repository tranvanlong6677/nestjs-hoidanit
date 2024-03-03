import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage("Create a new job")
  create(@Body() createJobDto: CreateJobDto, @User() user: IUser) {
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage("fetch job paginate")
  findAll(@Query("current") current: string, @Query("pageSize") pageSize: string, @Query() qs: string) {
    console.log( qs)
    return this.jobsService.findAll(current, pageSize, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage("Fetch a job by id")
  findOne(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update a job")
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUser) {
    return this.jobsService.update(id, updateJobDto, user._id);
  }

  @Delete(':id')
  @ResponseMessage("Delete a job")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user._id);
  }
}
