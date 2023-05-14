import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class GetUsersQueryDTO {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    value
      .trim()
      .split(',')
      .map((id: string) => Number(id))
  )
  ids?: number[];

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  [key: string]: string | number[] | undefined;
}
