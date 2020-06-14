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
          owner
        }
        nextToken
      }
      createdAt
      updatedAt
      owner
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
        owner
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
        owner
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
          owner
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
          owner
        }
        match_status
        similarity_score
        createdAt
        updatedAt
        owner
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
          owner
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
          owner
        }
        match_status
        similarity_score
        createdAt
        updatedAt
        owner
      }
      createdAt
      updatedAt
      owner
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
          owner
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
          owner
        }
        matchRight {
          match_status
          similarity_score
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
        owner
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
          owner
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
          owner
        }
        matchRight {
          match_status
          similarity_score
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
        owner
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
          owner
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
          owner
        }
        matchRight {
          match_status
          similarity_score
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
        owner
      }
      match_status
      similarity_score
      createdAt
      updatedAt
      owner
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
          owner
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
          owner
        }
        match_status
        similarity_score
        createdAt
        updatedAt
        owner
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
