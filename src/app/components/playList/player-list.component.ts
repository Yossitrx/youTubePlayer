import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListHandlerService } from '../../common/listHandler/listHandler.service';
import { Item, List } from '../../common/interface';
import { first } from 'rxjs/operators';

@Component({
  selector: 'player-list',
  providers: [
  ],
  styleUrls: ['./player-list.component.scss'],
  templateUrl: './player-list.component.html',
})
export class PlayerListComponent implements OnInit {
  @Input() public list: Item[];
  @Output() public onListChange: EventEmitter<Item> = new EventEmitter<Item>();

  constructor(private listHandlerService: ListHandlerService) {
  }

  public ngOnInit(): void {
    this.initList();
  }

  public removeItemFromList(item): void {
    this.listHandlerService.onVideoRemoved(item).pipe(first()).subscribe(() => {
      this.listHandlerService.getList().subscribe((listData: List) => {
        this.list = listData.list;
      });
    });
  }

  private initList(): void {
    this.listHandlerService.getItemSubscription().subscribe((video: Item) => {
      video.contentDetails.duration = ListHandlerService
        .convertIsoTimeToHumanTime(video.contentDetails.duration);
      if (this.list.length === 0) {
        this.onListChange.emit(video);
      }
      this.list.push(video);
    });
  }
}
