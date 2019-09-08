import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './components/player/player.component';
import { PlayerService } from './components/player/playerService/player.service';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material-module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoteHandlerService } from './common/noteHandler/noteHandler.service';
import { PlayerListComponent } from './components/playList/player-list.component';
import { NoteTileComponent } from './components/noteTile/note-tile.component';
import { InputFieldComponent } from './components/inputField/input-field.component';
import { ListHandlerService } from './common/listHandler/listHandler.service';
// tslint:disable-next-line:max-line-length
import { ErrorTemplateComponent } from './common/errorService/errorTemplate/errorTemplate.component';
import { ErrorService } from './common/errorService/error.service';
import { IconService } from './common/icons/icon.service';

@NgModule({
  declarations: [
    PlayerListComponent,
    NoteTileComponent,
    AppComponent,
    PlayerComponent,
    InputFieldComponent,
    ErrorTemplateComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    ListHandlerService,
    PlayerService,
    NoteHandlerService,
    ErrorService,
    IconService
  ],
  entryComponents: [ErrorTemplateComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
