/**
 * @module backend/events/events.controller
 * @description REST контроллер событий с полной Swagger-документацией
 */
import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, Req, Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('events')
@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список событий' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: 200, description: 'Список событий' })
  async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.eventsService.findAll({ category, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить событие по ID' })
  @ApiResponse({ status: 200, description: 'Событие найдено' })
  @ApiResponse({ status: 404, description: 'Событие не найдено' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать новое событие' })
  @ApiResponse({ status: 201, description: 'Событие создано' })
  async create(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.eventsService.create(dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить событие' })
  @ApiResponse({ status: 200, description: 'Событие обновлено' })
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto, @Req() req: any) {
    return this.eventsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить событие' })
  @ApiResponse({ status: 200, description: 'Событие удалено' })
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.remove(id, req.user.id);
  }

  @Post(':id/join')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Присоединиться к событию' })
  async join(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.join(id, req.user.id);
  }

  @Post(':id/leave')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Покинуть событие' })
  async leave(@Param('id') id: string, @Req() req: any) {
    return this.eventsService.leave(id, req.user.id);
  }

  @Get('users/me/events')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить события текущего пользователя (организованные и с участием)' })
  @ApiResponse({ status: 200, description: 'Список событий пользователя' })
  async getMyEvents(@Req() req: any) {
    return this.eventsService.findByUser(req.user.id);
  }
}
