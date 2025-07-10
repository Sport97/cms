import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  sender(sender: any): Contact | null {
    throw new Error('Method not implemented.');
  }
  contacts: Contact[] = [];
  contactSelectedEvent = new Subject<Contact>();
  contactChangedEvent = new Subject<Contact[]>();
  maxContactId!: number;

  constructor(private http: HttpClient) {
    this.getContacts();
  }

  getContacts() {
    this.http.get<Contact[]>('http://localhost:3000/contacts').subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts ?? [];
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => a.name.localeCompare(b.name));
        this.contactChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  getContact(id: string): Contact | null {
    return this.contacts.find((contact) => contact.id === id) || null;
  }

  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.findIndex((c) => c.id === contact.id);
    if (pos < 0) return;

    this.http
      .delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(() => {
        this.contacts.splice(pos, 1);
        this.contactChangedEvent.next(this.contacts.slice());
      });
  }

  getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
      const currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(newContact: Contact) {
    if (!newContact) return;

    newContact.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; contact: Contact }>(
        'http://localhost:3000/contacts',
        newContact,
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.contacts.push(responseData.contact);
        this.contactChangedEvent.next(this.contacts.slice());
      });
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;

    const pos = this.contacts.findIndex((c) => c.id === originalContact.id);
    if (pos < 0) return;

    newContact.id = originalContact.id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put('http://localhost:3000/contacts/' + originalContact.id, newContact, {
        headers: headers,
      })
      .subscribe(() => {
        this.contacts[pos] = newContact;
        this.contactChangedEvent.next(this.contacts.slice());
      });
  }
}
