import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { PlayerService } from '../player/playerService/player.service';
import { FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { MatAutocompleteTrigger } from '@angular/material';
import { MyErrorStateMatcher } from './errorStateMatcher/errorStateMatcher';
import { NoteHandlerService } from '../../common/noteHandler/noteHandler.service';
import { ListHandlerService } from '../../common/listHandler/listHandler.service';
import { ToggleSuggestions, VideoResponse } from '../../common/interface';
import { ErrorService } from '../../common/errorService/error.service';

@Component({
  selector: 'input-field',
  providers: [
  ],
  styleUrls: ['./input-field.component.scss'],
  templateUrl: './input-field.component.html',
})

export class InputFieldComponent {

  @ViewChild('matAutocomplete') public matAutocomplete: MatAutocompleteTrigger;
  @Output() public onToggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public stateCtrl = new FormControl('', [
    Validators.required,
  ]);
  public matcher: MyErrorStateMatcher;
  public toggleSuggestions: ToggleSuggestions = {
    checked: false,
    disabled: false
  };
  constructor(private playerService: PlayerService,
              private noteHandlerService: NoteHandlerService,
              private listHandlerService: ListHandlerService,
              private errorService: ErrorService) {
    this.matcher = new MyErrorStateMatcher();
  }

  public onFormSubmitted(value: string): void {
    this.matcher.isErrorState(this.stateCtrl, null)
      ? this.errorService.openSnackBar()
      : this.videoFormatSelection(value);
  }

  public videoFormatSelection(value: string): void {
    this.toggleSuggestions.checked
      ? this.fetchSuggestionsVideos(value)
      : this.fetchAndAddItemToList(value);

  }

  public onToggleSuggestionsChange(): void {
    this.toggleSuggestions.checked = !this.toggleSuggestions.checked;
    this.onToggleChange.emit(this.toggleSuggestions.checked);
  }

  private fetchAndAddItemToList(value: string): void {
    this.playerService.getSpecificSongDetails(value)
      .pipe(first())
      .subscribe((video: VideoResponse) => {
        isEmpty(video.items)
          ? this.videoNotFound()
          : this.listHandlerService.onAddItem(video);
      }, () => this.errorService.openSnackBar());
  }

  private videoNotFound() {
    this.errorService.openSnackBar();
  }

  private fetchSuggestionsVideos(value: string): void {
    this.playerService
      .getSearchQueryFromYoutube(value).pipe(first()).subscribe((videos: VideoResponse) => {
      this.updateSuggestion(videos);
    });
  }

  private updateSuggestion(videos: VideoResponse) {
    this.noteHandlerService.onNoteSuggestionsChange(videos.items);
  }

}
