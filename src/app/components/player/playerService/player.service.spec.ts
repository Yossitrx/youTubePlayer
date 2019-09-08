import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PlayerService } from './player.service';
import { API_KEY, YOUTUBE_TYPE } from '../../../common/system.consts';

describe('PlayerService', () => {
  let service: PlayerService;
  let httpClientStub: jasmine.SpyObj<HttpClient>;
  let errorMock: Partial<HttpErrorResponse>;

  beforeEach(() => {
    errorMock = {
      status: 500,
      error: 'error',
    };

    httpClientStub = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    httpClientStub.get.and.returnValue(of(true));
    // httpClientStub.post.and.returnValue(of(null));
    // httpClientStub.put.and.returnValue(of(null));
    // httpClientStub.delete.and.returnValue(of(null));

    TestBed.configureTestingModule({
      providers: [PlayerService,
        { provide: HttpClient, useValue: httpClientStub }]
    });

    service = TestBed.get(PlayerService);
  });

  describe('API testing', () => {
    it('Should get suggestion videos', () => {
      service.getSearchQueryFromYoutube('123');
      expect(httpClientStub.get)
        .toHaveBeenCalledWith('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: API_KEY,
            type: YOUTUBE_TYPE,
            maxResults: '3',
            part: 'id,snippet',
            fields:
              'items/id/videoId,' +
              'items/snippet/title,' +
              'items/snippet/thumbnails/default/url,' +
              'nextPageToken',
            q: '123'
          }
        });
    });
    it('Should get specific video', () => {
      service.getSpecificSongDetails('123');
      expect(httpClientStub.get)
        .toHaveBeenCalledWith('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            key: API_KEY,
            type: YOUTUBE_TYPE,
            id: '123',
            pageToken: '',
            part: 'id,snippet,contentDetails',
            fields: 'items/id,items/snippet/title,items/contentDetails/duration',
          }
        });
    });
  });
});
