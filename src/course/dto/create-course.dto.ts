import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { Type } from 'class-transformer';

export class CreateCourseDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  level: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  price: number;
}
