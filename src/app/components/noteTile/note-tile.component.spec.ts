import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Mock } from 'ts-mocks';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { ListHandlerService } from '../../common/listHandler/listHandler.service';
import { NoteTileComponent } from './note-tile.component';
import { PlayerService } from '../player/playerService/player.service';
import { MockComponent } from 'ng-mocks';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material';

describe('NoteTileComponent', () => {
  let component: NoteTileComponent;
  let fixture: ComponentFixture<NoteTileComponent>;
  let listHandlerServiceMock: Mock<ListHandlerService>;
  let playerServiceMock: Mock<PlayerService>;

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

    playerServiceMock = new Mock<PlayerService>({
      getSpecificSongDetails: () => cold('-x', { x: videoResponse }),
    });

    TestBed.configureTestingModule({
      declarations: [
        NoteTileComponent,
        MockComponent(MatCard),
        MockComponent(MatCardTitle),
        MockComponent(MatCardHeader),
      ],
      providers: [
        {
          provide: ListHandlerService,
          useFactory: () => listHandlerServiceMock.Object,
        },
        {
          provide: PlayerService,
          useFactory: () => playerServiceMock.Object,
        },
      ],
      imports: [
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NoteTileComponent);
        component = fixture.componentInstance;
        component.note = itemResponse;
        fixture.detectChanges();
      });
  }));

  describe('ngOnInit', () => {

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should add selected video to list', () => {
      const note = {
        id: {
          videoId: '123'
        },
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
      component.addSelectedVideoToList(note);
      getTestScheduler().flush();
      expect(playerServiceMock.Object.getSpecificSongDetails).toHaveBeenCalledWith('123');
      expect(listHandlerServiceMock.Object.onAddItem).toHaveBeenCalled();
    });
  });
});
