import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { invoke } from 'lodash';
import { Item } from '../interface';

@Injectable()
export class NoteHandlerService implements OnDestroy {

  public noteHandler$: ReplaySubject<Item[]> = new ReplaySubject();

  public getNoteSubscription(): ReplaySubject<Item[]> {
    if (!this.noteHandler$) {
      this.initNoteHandlerSubscription();
    }
    return this.noteHandler$;
  }

  public ngOnDestroy(): void {
    invoke(this.noteHandler$, 'unsubscribe');
  }

  public onNoteSuggestionsChange(items: Item[]) {
    this.noteHandler$.next(items);
  }

  private initNoteHandlerSubscription() {
    this.noteHandler$ = new ReplaySubject<Item[]>(1);
  }

}
