import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { ContactService } from '../../contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  standalone: false,
  templateUrl: './message-item.component.html',
  styleUrl: './message-item.component.css',
})
export class MessageItemComponent implements OnInit {
  @Input() message!: Message;
  messageSender!: string;

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    if (
      typeof this.message.sender === 'object' &&
      this.message.sender !== null
    ) {
      this.messageSender = this.message.sender.name;
    } else {
      this.messageSender = 'Stephen Port';
    }
  }
}
