import { Transform, TransformFnParams } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

const booleanMapper = (transformParams: TransformFnParams) => {
  switch (transformParams.value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return undefined;
  }
};

export class GetUsersMetricsQueryDTO {
  @IsOptional()
  @IsBoolean()
  @Transform(booleanMapper)
  federatedIdentity?: boolean;

  @IsOptional()
  @IsDateString()
  start?: string;

  @IsOptional()
  @IsDateString()
  end?: string;
}
