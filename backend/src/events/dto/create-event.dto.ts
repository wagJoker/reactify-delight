/**
 * @module backend/events/dto/create-event.dto
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, IsIn } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: 'React Conf 2026' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Конференция по React' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2026-06-15' })
  @IsString()
  date: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  time: string;

  @ApiProperty({ example: 'Киев, UNIT.City' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'conference', enum: ['conference', 'meetup', 'workshop', 'webinar', 'social', 'other'] })
  @IsIn(['conference', 'meetup', 'workshop', 'webinar', 'social', 'other'])
  category: string;

  @ApiProperty({ example: 'public', enum: ['public', 'private'] })
  @IsIn(['public', 'private'])
  @IsOptional()
  visibility?: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  maxParticipants: number;
}
