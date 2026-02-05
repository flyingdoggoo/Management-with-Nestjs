import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import recursivelyStripNullValues from './recursivelyStripNullValues';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => recursivelyStripNullValues(data)),
    );
  }
}
//ExecutionContext : it provides information about the current context
//CallHandler: it contains the  handle method that invoke the route handler and returns an RxJS Observable