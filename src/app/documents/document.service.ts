import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documents: Document[] = [];
  documentSelectedEvent = new Subject<Document>();
  documentChangedEvent = new Subject<Document[]>();
  maxDocumentId!: number;

  constructor(private http: HttpClient) {}

  getDocuments() {
    this.http
      .get<{ message: string; documents: Document[] }>(
        'http://localhost:3000/documents'
      )
      .subscribe(
        (responseData) => {
          this.documents = responseData.documents;
          this.maxDocumentId = this.getMaxId();
          this.sortAndSend();
        },
        (error: any) => {
          console.error('Error fetching documents:', error);
        }
      );
  }

  getDocument(id: string): Document | null {
    return this.documents.find((doc) => doc.id === id) || null;
  }

  addDocument(document: Document) {
    if (!document) return;

    document.id = '';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; document: Document }>(
        'http://localhost:3000/documents',
        document,
        { headers: headers }
      )
      .subscribe((responseData) => {
        this.documents.push(responseData.document);
        this.sortAndSend();
      });
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) return;

    const pos = this.documents.findIndex((d) => d.id === originalDocument.id);
    if (pos < 0) return;

    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .put(
        'http://localhost:3000/documents/' + originalDocument.id,
        newDocument,
        { headers: headers }
      )
      .subscribe(() => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      });
  }

  deleteDocument(document: Document) {
    if (!document) return;

    const pos = this.documents.findIndex((d) => d.id === document.id);
    if (pos < 0) return;

    this.http
      .delete('http://localhost:3000/documents/' + document.id)
      .subscribe(() => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      });
  }

  getMaxId(): number {
    let maxId = 0;
    for (let doc of this.documents) {
      const currentId = parseInt(doc.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  private sortAndSend() {
    this.documents.sort((a, b) => a.name.localeCompare(b.name));
    this.documentChangedEvent.next(this.documents.slice());
  }
}
