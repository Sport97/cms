import { Injectable } from '@angular/core';
import { Message } from './message.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new Subject<Message[]>();
  maxMessageId: number = 0;

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  getMessages() {
    this.http.get<Message[]>('http://localhost:3000/messages').subscribe(
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

    message.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ Message: string; message: Message }>(
        'http://localhost:3000/messages',
        message,
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.messages.push(responseData.message);
        this.messageChangedEvent.next(this.messages.slice());
      });
  }

  deleteMessage(message: Message) {
    if (!message) return;

    const pos = this.messages.findIndex((m) => m.id === message.id);
    if (pos < 0) return;

    this.http
      .delete('http://localhost:3000/messages/' + message.id)
      .subscribe(() => {
        this.messages.splice(pos, 1);
        this.messageChangedEvent.next(this.messages.slice());
      });
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) return;

    const pos = this.messages.findIndex((m) => m.id === originalMessage.id);
    if (pos < 0) return;

    newMessage.id = originalMessage.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put('http://localhost:3000/messages/' + originalMessage.id, newMessage, {
        headers: headers,
      })
      .subscribe(() => {
        this.messages[pos] = newMessage;
        this.messageChangedEvent.next(this.messages.slice());
      });
  }
}
