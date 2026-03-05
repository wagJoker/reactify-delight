/**
 * @module backend/events/events.service
 * @description Бизнес-логика управления событиями (SRP)
 */
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepo: Repository<Event>,
  ) {}

  async findAll(filters: { category?: string; search?: string }) {
    const query = this.eventRepo.createQueryBuilder('event');

    if (filters.category) {
      query.andWhere('event.category = :category', { category: filters.category });
    }

    if (filters.search) {
      query.andWhere('(event.title ILIKE :search OR event.description ILIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    return query.orderBy('event.date', 'ASC').getMany();
  }

  async findOne(id: string) {
    const event = await this.eventRepo.findOne({ where: { id } });
    if (!event) throw new NotFoundException('Событие не найдено');
    return event;
  }

  async create(dto: CreateEventDto, organizerId: string) {
    const event = this.eventRepo.create({
      ...dto,
      organizerId,
      participants: [],
    });
    return this.eventRepo.save(event);
  }

  async update(id: string, dto: UpdateEventDto, userId: string) {
    const event = await this.findOne(id);
    if (event.organizerId !== userId) {
      throw new ForbiddenException('Только организатор может редактировать');
    }
    Object.assign(event, dto);
    return this.eventRepo.save(event);
  }

  async remove(id: string, userId: string) {
    const event = await this.findOne(id);
    if (event.organizerId !== userId) {
      throw new ForbiddenException('Только организатор может удалить');
    }
    await this.eventRepo.remove(event);
    return { message: 'Событие удалено' };
  }

  async join(id: string, userId: string) {
    const event = await this.findOne(id);
    if (event.participants.includes(userId)) {
      throw new BadRequestException('Вы уже участвуете');
    }
    if (event.participants.length >= event.maxParticipants) {
      throw new BadRequestException('Нет свободных мест');
    }
    event.participants.push(userId);
    return this.eventRepo.save(event);
  }

  async leave(id: string, userId: string) {
    const event = await this.findOne(id);
    event.participants = event.participants.filter((p) => p !== userId);
    return this.eventRepo.save(event);
  }
}
