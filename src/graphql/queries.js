/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWhale = /* GraphQL */ `
  query GetWhale($id: ID!) {
    getWhale(id: $id) {
      id
      name
      pictures {
        items {
          id
          is_new
          high_res
          thumbnail
          filename
          geocoords
          date_taken
          embedding
          uploaded_by
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listWhales = /* GraphQL */ `
  query ListWhales(
    $filter: ModelWhaleFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWhales(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        pictures {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getConfig = /* GraphQL */ `
  query GetConfig($id: ID!) {
    getConfig(id: $id) {
      id
      value
      createdAt
      updatedAt
    }
  }
`;
export const listConfigs = /* GraphQL */ `
  query ListConfigs(
    $filter: ModelConfigFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listConfigs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        value
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getEuclidianDistance = /* GraphQL */ `
  query GetEuclidianDistance($picture1: String!, $picture2: String!) {
    getEuclidianDistance(picture1: $picture1, picture2: $picture2) {
      picture1
      picture2
      distance
      createdAt
      updatedAt
    }
  }
`;
export const listEuclidianDistances = /* GraphQL */ `
  query ListEuclidianDistances(
    $picture1: String
    $picture2: ModelStringKeyConditionInput
    $filter: ModelEuclidianDistanceFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listEuclidianDistances(
      picture1: $picture1
      picture2: $picture2
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        picture1
        picture2
        distance
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPicture = /* GraphQL */ `
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
        pictures {
          nextToken
        }
        createdAt
        updatedAt
      }
      geocoords
      date_taken
      embedding
      uploaded_by
      matchLeft {
        picture1 {
          id
          is_new
          high_res
          thumbnail
          filename
          geocoords
          date_taken
          embedding
          uploaded_by
          createdAt
          updatedAt
        }
        picture2 {
          id
          is_new
          high_res
          thumbnail
          filename
          geocoords
          date_taken
          embedding
          uploaded_by
          createdAt
          updatedAt
        }
        match_status
        similarity_score
        createdAt
        updatedAt
      }
      matchRight {
        picture1 {
          id
          is_new
          high_res
          thumbnail
          filename
          geocoords
          date_taken
          embedding
          uploaded_by
          createdAt
          updatedAt
        }
        picture2 {
          id
          is_new
          high_res
          thumbnail
          filename
          geocoords
          date_taken
          embedding
          uploaded_by
          createdAt
          updatedAt
        }
        match_status
        similarity_score
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listPictures = /* GraphQL */ `
  query ListPictures(
    $filter: ModelPictureFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPictures(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        is_new
        high_res
        thumbnail
        filename
        whale {
          id
          name
          createdAt
          updatedAt
        }
        geocoords
        date_taken
        embedding
        uploaded_by
        matchLeft {
          match_status
          similarity_score
          createdAt
          updatedAt
        }
        matchRight {
          match_status
          similarity_score
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMatch = /* GraphQL */ `
  query GetMatch($id: ID!) {
    getMatch(id: $id) {
      picture1 {
        id
        is_new
        high_res
        thumbnail
        filename
        whale {
          id
          name
          createdAt
          updatedAt
        }
        geocoords
        date_taken
        embedding
        uploaded_by
        matchLeft {
          match_status
          similarity_score
          createdAt
          updatedAt
        }
        matchRight {
          match_status
          similarity_score
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      picture2 {
        id
        is_new
        high_res
        thumbnail
        filename
        whale {
          id
          name
          createdAt
          updatedAt
        }
        geocoords
        date_taken
        embedding
        uploaded_by
        matchLeft {
          match_status
          similarity_score
          createdAt
          updatedAt
        }
        matchRight {
          match_status
          similarity_score
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      match_status
      similarity_score
      createdAt
      updatedAt
    }
  }
`;
export const listMatchs = /* GraphQL */ `
  query ListMatchs(
    $filter: ModelMatchFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMatchs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        picture1 {
          id
          is_new
          high_res
          thumbnail
          filename
          geocoords
          date_taken
          embedding
          uploaded_by
          createdAt
          updatedAt
        }
        picture2 {
          id
          is_new
          high_res
          thumbnail
          filename
          geocoords
          date_taken
          embedding
          uploaded_by
          createdAt
          updatedAt
        }
        match_status
        similarity_score
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMatchingImage = /* GraphQL */ `
  query GetMatchingImage($id: ID!) {
    getMatchingImage(id: $id) {
      id
      image {
        name
      }
      matchingImages {
        name
      }
      createdAt
      updatedAt
    }
  }
`;
export const listMatchingImages = /* GraphQL */ `
  query ListMatchingImages(
    $filter: ModelMatchingImageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMatchingImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        image {
          name
        }
        matchingImages {
          name
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const euclidianDistanceByPicture2 = /* GraphQL */ `
  query EuclidianDistanceByPicture2(
    $picture2: String
    $picture1: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEuclidianDistanceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    EuclidianDistanceByPicture2(
      picture2: $picture2
      picture1: $picture1
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        picture1
        picture2
        distance
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const pictureByIsNew = /* GraphQL */ `
  query PictureByIsNew(
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
          createdAt
          updatedAt
        }
        geocoords
        date_taken
        embedding
        uploaded_by
        matchLeft {
          match_status
          similarity_score
          createdAt
          updatedAt
        }
        matchRight {
          match_status
          similarity_score
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
