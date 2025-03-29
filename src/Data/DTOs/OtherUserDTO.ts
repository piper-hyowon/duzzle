export interface OtherUserDto {
  name: string;
  image: string;
  walletAddress: string;
  history: [{ rankedFirst: number; rankedThird: number; questStreak: number }];
  items: [{ count: number; name: string; image: string }];
  puzzles: [{ zone: string; image: string; season: string }];
}
