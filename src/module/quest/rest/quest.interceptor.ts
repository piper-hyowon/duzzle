import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { QuestService } from '../quest.service';

@Injectable({ scope: Scope.REQUEST })
export class StartQuestInterceptor implements NestInterceptor {
  constructor(
    @Inject(QuestService)
    private readonly questService: QuestService,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userId: number = request?.body?.userId;

    const { isAlreadyOngoing, log } =
      await this.questService.isAlreadyOngoing(userId);
    if (isAlreadyOngoing) {
      await this.questService.completeLog(log);
      // throw new HttpError(HttpStatus.CONFLICT, ExceptionCode.AlreadyExists);
    }

    return next.handle().pipe();
  }
}
