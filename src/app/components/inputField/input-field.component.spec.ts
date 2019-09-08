import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Mock } from 'ts-mocks';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { ListHandlerService } from '../../common/listHandler/listHandler.service';
import { PlayerService } from '../player/playerService/player.service';
import { MockComponent } from 'ng-mocks';
import {
  MatFormField,
  MatSlideToggle } from '@angular/material';
import { InputFieldComponent } from './input-field.component';
import { NoteHandlerService } from '../../common/noteHandler/noteHandler.service';
import { ErrorService } from '../../common/errorService/error.service';
import { FormsModule } from '@angular/forms';

describe('InputFieldComponent', () => {
  let component: InputFieldComponent;
  let fixture: ComponentFixture<InputFieldComponent>;
  let listHandlerServiceMock: Mock<ListHandlerService>;
  let playerServiceMock: Mock<PlayerService>;
  let noteHandlerServiceMock: Mock<NoteHandlerService>;
  let errorServiceMock: Mock<ErrorService>;

  const itemResponse = {
    id: '123',
    contentDetails: {
      duration: 'PT6S'
    },
    snippet: {
      thumbnails: {
        default: {
          url: 'youtubeThumbnails.com'
        }
      },
      title: 'hello SimilarWeb this is a note suggestion'
    }
  };

  const videoResponse = {
    items: [itemResponse]
  };

  beforeEach(async(() => {

    listHandlerServiceMock = new Mock<ListHandlerService>({
      onAddItem: () => cold('-x', { x: {} }),
    });

    errorServiceMock = new Mock<ErrorService>({
      openSnackBar: () => cold('-x', { x: {} }),
    });

    playerServiceMock = new Mock<PlayerService>({
      getSpecificSongDetails: () => cold('-x', { x: videoResponse }),
      getSearchQueryFromYoutube: () => cold('-x', { x: {} }),
    });

    noteHandlerServiceMock = new Mock<NoteHandlerService>({
      onNoteSuggestionsChange: () => cold('-x', { x: {}}),
    });

    TestBed.configureTestingModule({
      declarations: [
        InputFieldComponent,
        MockComponent(MatSlideToggle),
        MockComponent(MatFormField),
      ],
      providers: [
        {
          provide: PlayerService,
          useFactory: () => playerServiceMock.Object,
        },
        {
          provide: NoteHandlerService,
          useFactory: () => noteHandlerServiceMock.Object,
        },
        {
          provide: ListHandlerService,
          useFactory: () => listHandlerServiceMock.Object,
        },
        {
          provide: ErrorService,
          useFactory: () => errorServiceMock.Object,
        },
      ],
      imports: [
        FormsModule
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(InputFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
  }));
});
