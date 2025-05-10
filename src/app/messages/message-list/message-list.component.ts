import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css',
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Test subject', 'Test message.', 'Stephen'),
    new Message('2', 'Test subject again', 'Test message again.', 'James'),
    new Message('3', 'Test subject final', 'Test message final.', 'Port'),
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
