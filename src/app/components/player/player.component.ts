import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { isEmpty, cloneDeep, get } from 'lodash';
import { Observable } from 'rxjs';
import { NoteHandlerService } from '../../common/noteHandler/noteHandler.service';
import { ListHandlerService } from '../../common/listHandler/listHandler.service';
import { Item, List } from '../../common/interface';
import { first } from 'rxjs/operators';
import { IconService } from '../../common/icons/icon.service';

@Component({
  selector: 'player',
  providers: [
  ],
  styleUrls: ['./player.component.scss'],
  templateUrl: './player.component.html',
})
export class PlayerComponent implements OnInit {

  private static onPlayerError(): void {
    console.log('YouTube Player error');
  }
  @ViewChild('playList') public playListElement;
  @ViewChild('inputField') public inputField;

  public YT: any;
  public player: any;
  public playlist: Item[];
  public viewReady: boolean = false;
  public list: Item[];
  public videoSuggestions$: Observable<Item[]>;
  public showSuggestions: boolean;

  constructor(private noteHandlerService: NoteHandlerService,
              private listHandlerService: ListHandlerService,
              private iconService: IconService,
              public zone: NgZone) {
  }

  public ngOnInit(): void {
    console.log(1);
    this.initPlayerConfig();
    this.initializeListPolling();
    this.initVideoSuggestions();
    this.iconService.initIcons();
  }

  public onYouTubeIframeAPIReady(): void {
    this.YT = window['YT'];
    this.listHandlerService.getList().subscribe((listData: List) => {
      this.playlist = cloneDeep(listData.list);
      this.list = cloneDeep(listData.list);
      this.viewReady = true;
      window['onYouTubeIframeAPIReady'] = (e) => {
        let firstSong = null;
        if (!isEmpty(this.playlist)) {
          firstSong = this.playlist.shift();
        }
        this.player = new window['YT'].Player('player', {
          height: '390',
          width: '640',
          videoId: get(firstSong, 'id', null),
          playerVars: {
            autoplay: 1,
            controls: 0,
          },
          events: {
            onStateChange: this.onPlayerStateChange.bind(this),
            onError: PlayerComponent.onPlayerError.bind(this),
          }
        });
      };
    });
  }

  public initVideoSuggestions(): void {
    this.videoSuggestions$ = this.noteHandlerService.getNoteSubscription();
  }

  public onListChange($event): void {
    this.player.loadVideoById($event.id);
  }

  public onToggleChange($event): void {
    this.showSuggestions = $event;
  }

  private initPlayerConfig(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    this.onYouTubeIframeAPIReady();
  }

  private onPlayerStateChange(event): void {
    switch (event.data) {
      case window['YT'].PlayerState.ENDED:
        this.listHandlerService.onVideoRemoved(this.list[0]).pipe(first()).subscribe(() => {
          this.zone.run(() => {
            this.list.shift();
          });
          if (!isEmpty(this.list)) {
            this.player.loadVideoById(this.list[0].id);
          }
        });
        break;
    }
  }

  private initializeListPolling(): void {
    this.listHandlerService.getListPollingObservable()
        .pipe()
        .subscribe(
          (listData: Item[]) => {
            this.zone.run(() => this.list = listData);
          });
  }
}
