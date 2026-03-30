export interface ReviewAuthor {
  fullName: string;
}

export interface VehicleReview {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: ReviewAuthor;
}

export interface UserVehicleReview {
  id: string;
  rating: number;
  comment: string;
}

export interface ReviewsSummary {
  reviews: VehicleReview[];
  averageRating: number;
  totalReviews: number;
}
