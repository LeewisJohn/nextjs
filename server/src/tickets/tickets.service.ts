import { Injectable } from '@nestjs/common';
import { Ticket } from '@acme/shared-models';
import { UsersService } from '../users/users.service';

@Injectable()
export class TicketsService {
  /*
   * In-memory storage so data is lost on server restart.
   */
  storedTickets: Ticket[] = [
    {
      id: 1,
      description: 'Install a monitor arm',
      assigneeId: null,
      completed: false,
    },
    {
      id: 2,
      description: 'Move the desk to the new location',
      assigneeId: 2,
      completed: false,
    },
    {
      id: 3,
      description: 'Change the light bulb',
      assigneeId: 5,
      completed: false,
    },
    {
      id: 4,
      description: 'Buy a new mop',
      assigneeId: 4,
      completed: true,
    },
    {
      id: 5,
      description: 'Go buy a new computer',
      assigneeId: 3,
      completed: true,
    },
  ];

  private nextId = 6;

  constructor(private usersService: UsersService) { }

  async tickets(): Promise<Ticket[]> {
    const items = Array.from({ length: 5000 }, (_, index) => {
      // Lấy đối tượng mẫu dựa trên index, sử dụng toán tử % để lặp lại 5 mẫu
      const template = this.storedTickets[index % this.storedTickets.length];

      // Tạo đối tượng mới với id và các thuộc tính từ mẫu
      return {
        ...template,
        id: index
      };
    });
    // this.storedTickets = items;

    return this.storedTickets;
  }

  async ticket(id: number): Promise<Ticket | null> {
    return this.storedTickets.find((t) => t.id === id) ?? null;
  }

  async newTicket(payload: { description: string }): Promise<Ticket> {
    const newTicket: Ticket = {
      id: this.nextId++,
      description: payload.description,
      assigneeId: null,
      completed: false,
    };

    this.storedTickets.push(newTicket);

    return newTicket;
  }

  async assign(ticketId: number, userId: number): Promise<boolean> {
    const ticket = await this.ticket(ticketId);
    const user = await this.usersService.user(userId);

    if (ticket && user) {
      ticket.assigneeId = +userId;
      return true;
    } else {
      return false;
    }
  }

  async unassign(ticketId: number): Promise<boolean> {
    const ticket = await this.ticket(ticketId);
    if (ticket) {
      ticket.assigneeId = null;
      return true;
    } else {
      return false;
    }
  }

  async complete(ticketId: number, completed: boolean): Promise<boolean> {
    const ticket = await this.ticket(ticketId);
    if (ticket) {
      ticket.completed = completed;
      return true;
    } else {
      return false;
    }
  }
}
