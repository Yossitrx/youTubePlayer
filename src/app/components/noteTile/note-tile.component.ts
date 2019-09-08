import { Component, Input } from '@angular/core';
import { ListHandlerService } from '../../common/listHandler/listHandler.service';
import { PlayerService } from '../player/playerService/player.service';
import { first } from 'rxjs/operators';
import { Item, VideoResponse } from '../../common/interface';

@Component({
  selector: 'note-tile',
  templateUrl: './note-tile.component.html',
  styleUrls: ['./note-tile.component.scss'],
})
export class NoteTileComponent {

  @Input() public note: Item;

  constructor(
    private playerService: PlayerService,
    private listHandlerService: ListHandlerService) {

  }

  public addSelectedVideoToList(note) {
    console.log('note', note);
    const videoId = note.id.videoId;
    this.playerService.getSpecificSongDetails(videoId)
      .pipe(first())
      .subscribe((video: VideoResponse) => {
        this.listHandlerService.onAddItem(video);
      });
  }
}
