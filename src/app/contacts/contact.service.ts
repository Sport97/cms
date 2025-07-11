import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactChangedEvent = new Subject<Contact[]>();
  contactSelectedEvent = new EventEmitter<Contact>();
  contacts: Contact[] = [];
  maxContactId: number | undefined;

  constructor(private http: HttpClient) {
    this.getContacts();
  }

  getContacts(): void {
    this.http
      .get<{ message: string; contacts: Contact[] }>(
        'http://localhost:3000/contacts'
      )
      .subscribe({
        next: (response) => {
          this.contacts = response.contacts;
          this.contacts.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          this.maxContactId = this.getMaxId();
          this.contactChangedEvent.next([...this.contacts]);
        },
        error: (error) => {
          console.error('Error fetching contacts:', error);
        },
      });
  }

  getContact(id: string): Contact | null {
    return this.contacts.find((contact) => contact.id === id) || null;
  }

  addContact(newContact: Contact): void {
    if (!newContact) return;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    newContact.id = '';
    this.http
      .post<{
        message: string;
        contact: Contact;
      }>('http://localhost:3000/contacts', newContact, { headers })
      .subscribe({
        next: (response) => {
          this.contacts.push(response.contact);
          this.contactChangedEvent.next([...this.contacts]);
        },
        error: (error) => console.error('Error adding contact:', error),
      });
  }

  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) return;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const id = originalContact.id;
    newContact._id = originalContact._id;
    this.http
      .put(`http://localhost:3000/contacts/${id}`, newContact, { headers })
      .subscribe({
        next: () => {
          const index = this.contacts.findIndex(
            (c) => c._id === originalContact._id
          );
          this.contacts[index] = newContact;
          this.contactChangedEvent.next([...this.contacts]);
        },
        error: (error) => console.error('Error updating contact:', error),
      });
  }

  deleteContact(contact: Contact): void {
    if (!contact) return;
    this.http.delete(`http://localhost:3000/contacts/${contact.id}`).subscribe({
      next: () => {
        this.contacts = this.contacts.filter((c) => c._id !== contact._id);
        this.contactChangedEvent.next([...this.contacts]);
      },
      error: (error) => console.error('Error deleting contact:', error),
    });
  }

  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
