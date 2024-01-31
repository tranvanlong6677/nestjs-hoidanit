import { Controller, Delete, Get } from '@nestjs/common';

@Controller("user")
export class UserController {
  constructor() { }

  @Get()
  findAll(): string {
    return "This action returns all users";
  }

  @Get("/by-id")
  findById(): string {
    return 'This action will delete a user by id'
  }

}
