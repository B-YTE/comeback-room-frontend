import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateNickname } from '@/features/mypage/api/profile';

export const useProfile = () => {
  const client = useQueryClient();
  const profile = useQuery({
    queryKey: ['my-profile'],
    queryFn: ({ signal }) => getProfile(signal),
    retry: false,
  });
  const nickname = useMutation({
    mutationFn: updateNickname,
    onSuccess: () => client.invalidateQueries({ queryKey: ['my-profile'] }),
  });
  return { profile, nickname };
};
