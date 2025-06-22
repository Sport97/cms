import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();
  maxMessageId: number = 0;

  constructor(private http: HttpClient) {}

  getMessages() {
    this.http
      .get<Message[]>(
        'https://cms-db-8241f-default-rtdb.firebaseio.com/messages.json'
      )
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages ?? [];
          this.maxMessageId = this.getMaxId();
          this.messageChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.error('Error fetching messages:', error);
        }
      );
  }

  getMessage(id: string): Message | null {
    return this.messages.find((msg) => msg.id === id) || null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (let msg of this.messages) {
      const currentId = parseInt(msg.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addMessage(message: Message) {
    if (!message) return;

    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    this.storeMessages();
  }

  storeMessages() {
    const messagesString = JSON.stringify(this.messages);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(
        'https://cms-db-8241f-default-rtdb.firebaseio.com/messages.json',
        messagesString,
        { headers: headers }
      )
      .subscribe(() => {
        this.messageChangedEvent.next(this.messages.slice());
      });
  }
}
