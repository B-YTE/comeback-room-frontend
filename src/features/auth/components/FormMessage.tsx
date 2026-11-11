import { cn } from '@/shared/utils/cn';

export interface Feedback {
  text: string;
  isError: boolean;
}

// 인증번호 발송·중복 확인·제출 결과를 입력창 아래에 보여 준다
export const FormMessage = ({ feedback }: { feedback: Feedback | null }) => {
  if (!feedback) return null;

  return (
    <p
      role={feedback.isError ? 'alert' : 'status'}
      className={cn(
        'typo-body-medium',
        feedback.isError ? 'text-status-negative' : 'text-status-positive',
      )}
    >
      {feedback.text}
    </p>
  );
};
