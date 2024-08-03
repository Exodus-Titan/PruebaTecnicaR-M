import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCharacterDto{

    constructor(){
    }


    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsString()
    @IsNotEmpty()
    species?: string;

    @IsString()
    @IsNotEmpty()
    origin?: string;

    @IsString()
    @IsNotEmpty()
    location?: string;

    @IsString()
    @IsNotEmpty()
    gender?: string;

    @IsString()
    @IsNotEmpty()
    state?: string;

    @IsArray()
    @IsNotEmpty()
    episodes?: number[];
}