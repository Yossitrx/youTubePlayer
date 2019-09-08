import { Injectable, OnDestroy } from '@angular/core';
import { interval, Observable, ReplaySubject, Subject } from 'rxjs';
import { invoke } from 'lodash';
import * as moment from 'moment';
import { first, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { API } from '../API.const';
import { Item, List, VideoResponse } from '../interface';

@Injectable()
export class ListHandlerService implements OnDestroy {
  public static convertIsoTimeToHumanTime(durationToConvert: string | number): number {
    return moment.duration(durationToConvert).asSeconds();
  }

  public static initError(error): void {
    console.log('Error', error);
  }
  public listItemHandler$: ReplaySubject<Item> = new ReplaySubject();
  public listPollingObservable: ReplaySubject<Item[]>;

  private intervalValue: Subject<number> = new Subject();
  private millisecondsTime: number = 30000;

  constructor(private httpClient: HttpClient) {}

  public onAddItem(itemsData: VideoResponse): void {
    const video = itemsData.items[0];
    this.addVideoToList(video).pipe(first()).subscribe((data) => {
      this.listItemHandler$.next(video);
    });
  }

  public addVideoToList(video: Item) {
    return this.httpClient.post(API.list, {video});
  }

  public getItemSubscription(): ReplaySubject<Item> {
    if (!this.listItemHandler$) {
      this.initItemHandlerSubscription();
    }
    return this.listItemHandler$;
  }

  public getListPollingObservable(): ReplaySubject<Item[]> {
    this.initListPollingObservable();
    return this.listPollingObservable;
  }

  public getList(): Observable<List> {
    return this.httpClient.get<List>(API.list);
  }

  public onVideoRemoved(video): Observable<string> {
    return this.httpClient.put<string>(API.update, { video });
  }

  public ngOnDestroy(): void {
    invoke(this.listItemHandler$, 'unsubscribe');
  }

  private updatePollingHandler(): void {
    this.intervalValue
      .pipe(
        switchMap((time: number) => interval(time)))
      .subscribe(() => {
        this.httpClient.get(API.list).pipe(
          first())
          .subscribe(
            (listData: List) => {
              this.publishList(listData.list);
            }, (error) => ListHandlerService.initError(error));
      });
    this.intervalValue.next(this.millisecondsTime);
  }

  private initListPollingObservable(): void {
    if (!this.listPollingObservable) {
      this.listPollingObservable = new ReplaySubject<Item[]>(1);
    }
    this.updatePollingHandler();
  }

  private publishList(list: Item[]): void {
    if (this.listPollingObservable) {
      this.listPollingObservable.next(list);
    }
  }

  private initItemHandlerSubscription(): void {
    this.listItemHandler$ = new ReplaySubject<Item>(1);
  }

}
