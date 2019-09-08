import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Mock } from 'ts-mocks';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { ListHandlerService } from '../../common/listHandler/listHandler.service';
import { NoteHandlerService } from '../../common/noteHandler/noteHandler.service';
import { IconService } from '../../common/icons/icon.service';
import { PlayerComponent } from './player.component';
import {NgZone} from '@angular/core';

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;
  let listHandlerServiceMock: Mock<ListHandlerService>;
  let noteHandlerServiceMock: Mock<NoteHandlerService>;
  let iconServiceMock: Mock<IconService>;

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
      getList: () => cold('-x', { x: {} }),
      onVideoRemoved: () => cold('-x', { x: {} }),
      getListPollingObservable: () => cold('-x', { x: videoResponse }) as any,
    });

    noteHandlerServiceMock = new Mock<NoteHandlerService>({
      getNoteSubscription: () => cold('-x', { x: videoResponse}) as any,
    });

    iconServiceMock = new Mock<IconService>({
      initIcons: () => cold('-x', { x: {}}),
    });

    TestBed.configureTestingModule({
      declarations: [
        PlayerComponent,
      ],
      providers: [
        {
          provide: NoteHandlerService,
          useFactory: () => noteHandlerServiceMock.Object,
        },
        {
          provide: ListHandlerService,
          useFactory: () => listHandlerServiceMock.Object,
        },
        {
          provide: IconService,
          useFactory: () => iconServiceMock.Object,
        },
        {
          provide: NgZone,
        },
      ],
      imports: [
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });

    describe('ngOnInit', () => {
      it('should create component', () => {
        expect(component).toBeTruthy();
        expect(false).toBeTruthy();
      });
    });
  }));
});
