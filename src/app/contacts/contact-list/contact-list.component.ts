import { Component, OnDestroy, OnInit } from '@angular/core';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  standalone: false,
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  private conSubscription!: Subscription;
  term: string = '';

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.conSubscription = this.contactService.contactChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    );
    this.contactService.getContacts();
  }

  search(value: string) {
    this.term = value;
  }

  onSelectedContact(contact: Contact) {
    this.contactService.contactSelectedEvent.next(contact);
  }

  ngOnDestroy(): void {
    if (this.conSubscription) {
      this.conSubscription.unsubscribe();
    }
  }
}
