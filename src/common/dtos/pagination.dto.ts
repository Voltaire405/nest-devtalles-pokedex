import { IsNumber, IsOptional, IsPositive, Min, MinLength } from 'class-validator';

export class PaginationDto{
    
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(1)
    limit : number;


    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset : number;
}