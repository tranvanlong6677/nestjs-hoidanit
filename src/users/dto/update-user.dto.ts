import { IsEmail } from 'class-validator';
import { Company } from 'src/companies/schema/company.schema';

export class UpdateUserDto  {
    name:string

    @IsEmail()
    email:string

    age:number

    gender:string

    address:string

    role:string

    company:Company
    
 } 
