import { Injectable } from '@angular/core';
import { API } from '../../../common/API.const';
import { HttpClient } from '@angular/common/http';
import { API_KEY, YOUTUBE_TYPE } from '../../../common/system.consts';

@Injectable()
export class PlayerService {
  constructor(private httpClient: HttpClient) {}

  public getSearchQueryFromYoutube(query: string) {
    console.log('getSearchQueryFromYoutube', query);
    return this.httpClient.get(API.youTube.search, {
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
        q: query
      }
    });
  }

  public getSpecificSongDetails(videoId: string) {
    return this.httpClient.get(API.youTube.video, {
      params: {
        key: API_KEY,
        type: YOUTUBE_TYPE,
        id: videoId,
        pageToken: '',
        part: 'id,snippet,contentDetails',
        fields: 'items/id,items/snippet/title,items/contentDetails/duration',
      }
    });
  }
}
