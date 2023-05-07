import { Transform } from 'class-transformer';
import { IsArray, IsInt } from 'class-validator';

export class GetUsersQueryDTO {
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) =>
    value
      .trim()
      .split(',')
      .map((id: string) => Number(id))
  )
  ids?: number[];

  message?: string;
}
