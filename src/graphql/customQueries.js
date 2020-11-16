export const listPictures = /* GraphQL */ `
  query ListPictures(
    $filter: ModelPictureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPictures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
      }
      nextToken
    }
  }
`;

export const getEuclidianDistances = /* GraphQL */ `
  query GetEuclidianDistances($picture: String!) {
    getEuclidianDistances(picture: $picture) {
      picture
      distances(limit: 5000) {
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

/* modified new picture query to save some memory space (embeddings, etc. excluded here) */
export const pictureByIsNewFiltered = /* GraphQL */ `
  query PictureByIsNewFiltered(
    $is_new: Int
    $sortDirection: ModelSortDirection
    $filter: ModelPictureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    PictureByIsNew(
      is_new: $is_new
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        is_new
        high_res
        thumbnail
        filename
        whale {
          id
          name
        }
        geocoords
        date_taken
        uploaded_by
        createdAt
      }
      nextToken
    }
  }
`;

/* modified  getPicture query to save memory space (embeddings, etc. excluded here) */
export const getPictureFiltered = /* GraphQL */ `
  query GetPicture($id: ID!) {
    getPicture(id: $id) {
      id
      is_new
      high_res
      thumbnail
      filename
      whale {
        id
        name
      }
      geocoords
      date_taken
      uploaded_by
      createdAt
    }
  }
`;
