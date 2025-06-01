import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WindRefService {
  constructor() {}

  getNativeWindow(): any {
    return window;
  }
}
