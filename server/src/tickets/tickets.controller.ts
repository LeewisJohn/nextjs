import {
  NotFoundException,
  UnprocessableEntityException,
  Controller,
  Get,
  Put,
  Post,
  Param,
  Delete,
  Body,
  HttpCode,
} from '@nestjs/common';
import { randomDelay } from '../utils/random-delay';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) { }

  @Get()
  async getTicketss() {
    return this.ticketsService.tickets();
  }

  @Get('ok')
  async getOK() {
    return {};
  }

  @Get(':id')
  async getTicket(@Param('id') id: string) {
    const ticket = await this.ticketsService.ticket(Number(id));
    if (ticket) return ticket;
    throw new NotFoundException();
  }

  @Post()
  async createTicket(@Body() createDto: { description: string }) {
    return this.ticketsService.newTicket(createDto);
  }

  @Put(':ticketId/assign/:userId')
  @HttpCode(204)
  async assignTicket(
    @Param('ticketId') ticketId: string,
    @Param('userId') userId: string
  ) {
    const success = await this.ticketsService.assign(
      Number(ticketId),
      Number(userId)
    );
    if (!success) throw new UnprocessableEntityException();
  }

  @Put(':ticketId/unassign')
  @HttpCode(204)
  async unassignTicket(@Param('ticketId') ticketId: string) {
    const success = await this.ticketsService.unassign(Number(ticketId));
    if (!success) throw new UnprocessableEntityException();
  }

  @Put(':id/complete')
  @HttpCode(204)
  async markAsComplete(@Param('id') ticketId: string) {
    const success = await this.ticketsService.complete(Number(ticketId), true);
    if (!success) throw new UnprocessableEntityException();
  }

  @Delete(':id/complete')
  @HttpCode(204)
  async markAsIncomplete(@Param('id') ticketId: string) {
    const success = await this.ticketsService.complete(Number(ticketId), false);
    if (!success) throw new UnprocessableEntityException();
  }
}
