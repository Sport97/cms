import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = parseInt(message.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getMessages() {
    this.http.get<Message[]>('http://localhost:3000/messages').subscribe(
      (responseData) => {
        this.messages = responseData;
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getMessage(id: string): Message | null {
    return this.messages.find((message) => message.id === id) || null;
  }

  addMessage(message: Message): void {
    if (!message) return;

    message.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{
        message: string;
        messageObj: Message;
      }>('http://localhost:3000/messages', message, { headers: headers })
      .subscribe((responseData) => {
        this.messages.push(responseData.messageObj);
        this.messageChangedEvent.next(this.messages.slice());
      });
  }
}
