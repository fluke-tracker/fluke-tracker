export const listPictures = /* GraphQL */ `
  query ListPictures(
    $filter: ModelPictureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPictures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        },
      nextToken
    }
  }
`;

export const getEuclidianDistances = /* GraphQL */ `
  query GetEuclidianDistances($picture: String!) {
    getEuclidianDistances(picture: $picture) {
      picture
      distances(limit:5000) {
        items {
          id
          picture
          distance
        }
        nextToken
      }
    }
  }
`;