import { QuestionCategory } from '../enum/support.enum';

export class PostQuestionDto {
  userId: number;
  question: string;
  category: QuestionCategory;
  email: string;
}
