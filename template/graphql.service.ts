import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const GraphQLUrl = 'http://localhost:5000/graphql';  // URL to web api

@Injectable()
export class GraphQLService {

  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink
  ) {
    apollo.create({
      link: httpLink.create({ uri: GraphQLUrl }),
      cache: new InMemoryCache() // To better support cache updates, consider parameter: {dataIdFromObject: (o: Node) => o.nodeId})
    });
  }

  /* Query (read) record(s), matching variables where necessary */
  query<T>(query: any, variables: any = {}, description: string = 'read'): Observable<T> {
    return this.apollo.subscribe({query: query, variables: variables}).pipe(
      map(({data}) => data),
      catchError(this.handleError<T>
        (\`Query=$\{JSON.stringify(query)} Variables=$\{JSON.stringify(variables)} Description=$\{description}\`))
    );
  }

  /** Mutate (create, update or delete) a record on the server */
  mutate<T>(mutation: any, variables: any = {}, description: string = 'mutate'): Observable<{ [key: string]: any; } | T> {
    let results: any;
    return this.apollo.mutate<T>({mutation: mutation, variables: variables}).pipe(
      map(({data}) => results = data),
      catchError(this.handleError<T>
        (\`Mutation=$\{JSON.stringify(mutation)} Variables=$\{JSON.stringify(variables)} Description=$\{description}\`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
