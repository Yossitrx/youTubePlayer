import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ListHandlerService } from './listHandler.service';

describe('ListHandlerService', () => {
  let service: ListHandlerService;
  let httpClientStub: jasmine.SpyObj<HttpClient>;
  let errorMock: Partial<HttpErrorResponse>;

  beforeEach(() => {
    errorMock = {
      status: 500,
      error: 'error',
    };

    httpClientStub = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);
    httpClientStub.get.and.returnValue(of(true));
    httpClientStub.post.and.returnValue(of(null));
    httpClientStub.put.and.returnValue(of(null));

    TestBed.configureTestingModule({
      providers: [ListHandlerService,
        { provide: HttpClient, useValue: httpClientStub }]
    });

    service = TestBed.get(ListHandlerService);
  });

  describe('API testing', () => {
    it('Should add video to list', () => {
      const itemToAdd = {
        id: '123',
        contentDetails: {
          duration: 'PT6S'
        },
        snippet: {
          title: 'hello SimilarWeb this is a note suggestion'
        }
      };
      service.addVideoToList(itemToAdd);
      expect(httpClientStub.post)
        .toHaveBeenCalledWith('http://localhost:8088/list', {video: itemToAdd});
    });
    it('Should remove a video', () => {
      const itemToRemove = {
        id: '123',
        contentDetails: {
          duration: 'PT6S'
        },
        snippet: {
          title: 'hello SimilarWeb this is a note suggestion'
        }
      };
      service.onVideoRemoved(itemToRemove);
      expect(httpClientStub.put)
        .toHaveBeenCalledWith('http://localhost:8088/list/update', {video: itemToRemove});
    });
  });
});
