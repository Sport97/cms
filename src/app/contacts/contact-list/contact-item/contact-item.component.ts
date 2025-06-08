import { Component, Input, Output } from '@angular/core';
import { Contact } from '../../contact.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-contact-item',
  standalone: false,
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.css',
})
export class ContactItemComponent {
  @Input() contact!: Contact;
  @Output() contactSelected = new Subject<void>();
  @Input() id!: string;

  onSelected() {
    this.contactSelected.next();
  }
}
