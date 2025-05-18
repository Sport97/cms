import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent {
  documents: Document[] = [
    new Document('1', 'T', 'Test', 'http://localhost:4200/t', []),
    new Document('2', 'E', 'Again test', 'http://localhost:4200/e', []),
    new Document('3', 'S', 'Another test', 'http://localhost:4200/s', []),
    new Document('4', 'T', 'Final test', 'http://localhost:4200/t', []),
  ];

  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
