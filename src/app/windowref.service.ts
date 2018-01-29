import { Injectable } from '@angular/core';

@Injectable()
export class Windowref {

  constructor() { }

  getNativeWindow() {
    return window;
  }
}
