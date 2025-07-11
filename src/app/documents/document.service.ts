import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentChangedEvent = new Subject<Document[]>();
  documentSelectedEvent = new EventEmitter<Document>();
  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.getDocuments();
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    this.http.get<Document[]>('http://localhost:3000/documents').subscribe(
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        this.documentChangedEvent.next(this.documents.slice());
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getDocument(id: string): Document | null {
    if (!id) {
      return null;
    }
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }
    document.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .post<{
        message: string;
        document: Document;
      }>('http://localhost:3000/documents', document, { headers: headers })
      .subscribe((responseData) => {
        this.documents.push(responseData.document);
        this.documentChangedEvent.next(this.documents.slice());
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .put(
        'http://localhost:3000/documents/' + originalDocument.id,
        newDocument,
        {
          headers: headers,
        }
      )
      .subscribe(() => {
        this.documents[pos] = newDocument;
        this.documentChangedEvent.next(this.documents.slice());
      });
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.findIndex((d) => d.id === document.id);
    if (pos < 0) {
      return;
    }
    this.http
      .delete('http://localhost:3000/documents/' + document.id)
      .subscribe(() => {
        this.documents.splice(pos, 1);
        this.documentChangedEvent.next(this.documents.slice());
      });
  }
}
