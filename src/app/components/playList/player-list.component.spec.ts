import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Mock } from 'ts-mocks';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { PlayerListComponent } from './player-list.component';
import { ListHandlerService } from '../../common/listHandler/listHandler.service';
import { MockComponent } from 'ng-mocks';
import { MatIcon } from '@angular/material';

describe('PlayerListComponent', () => {
  let component: PlayerListComponent;
  let fixture: ComponentFixture<PlayerListComponent>;
  let listHandlerServiceMock: Mock<ListHandlerService>;

  const itemResponse = {
    id: '123',
    contentDetails: {
      duration: 'PT6S'
    },
    snippet: {
      title: 'hello SimilarWeb'
    }
  };

  beforeEach(async(() => {

    listHandlerServiceMock = new Mock<ListHandlerService>({
      getItemSubscription: () => cold('-x', { x: itemResponse }) as any,

    });

    TestBed.configureTestingModule({
      declarations: [
        PlayerListComponent,
        MockComponent(MatIcon),
      ],
      providers: [
        {
          provide: ListHandlerService,
          useFactory: () => listHandlerServiceMock.Object,
        },
      ],
      imports: [
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PlayerListComponent);
        component = fixture.componentInstance;
        component.list = [];
        fixture.detectChanges();
      });
  }));

  describe('ngOnInit', () => {

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should get video into list', () => {
      expect(listHandlerServiceMock.Object.getItemSubscription).toHaveBeenCalled();
    });

    it('should show video list with correct time format', () => {
      getTestScheduler().flush();
      const listRes = [{
        id: '123',
        contentDetails: {
          duration: 0.000006
        },
        snippet: {
          title: 'hello SimilarWeb'
        }
      }];
      expect(component.list).toContain(listRes[0]);
    });
  });
});
