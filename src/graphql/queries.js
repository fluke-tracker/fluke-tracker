/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWhale = /* GraphQL */ `
  query GetWhale($id: ID!) {
    getWhale(id: $id) {
      name
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
        name
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
      high_res
      thumbnail
      filename
      whale {
        name
        createdAt
        updatedAt
      }
      geocoords
      date_taken
      embedding
      uploaded_by
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
        high_res
        thumbnail
        filename
        whale {
          name
          createdAt
          updatedAt
        }
        geocoords
        date_taken
        embedding
        uploaded_by
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMatches = /* GraphQL */ `
  query GetMatches($id: ID!) {
    getMatches(id: $id) {
      picture1 {
        high_res
        thumbnail
        filename
        whale {
          name
          createdAt
          updatedAt
        }
        geocoords
        date_taken
        embedding
        uploaded_by
        createdAt
        updatedAt
      }
      picture2 {
        high_res
        thumbnail
        filename
        whale {
          name
          createdAt
          updatedAt
        }
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
  }
`;
export const listMatchess = /* GraphQL */ `
  query ListMatchess(
    $filter: ModelMatchesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMatchess(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        picture1 {
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
