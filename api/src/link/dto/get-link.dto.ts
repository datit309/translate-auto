import {IsNotEmpty} from "class-validator";

export class GetLinkDto {

    @IsNotEmpty()
    short_link: string;

    // @IsNotEmpty()
    password: string;
}
