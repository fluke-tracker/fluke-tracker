/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createWhale = /* GraphQL */ `
  mutation CreateWhale(
    $input: CreateWhaleInput!
    $condition: ModelWhaleConditionInput
  ) {
    createWhale(input: $input, condition: $condition) {
      name
      pictures {
        items {
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
export const updateWhale = /* GraphQL */ `
  mutation UpdateWhale(
    $input: UpdateWhaleInput!
    $condition: ModelWhaleConditionInput
  ) {
    updateWhale(input: $input, condition: $condition) {
      name
      pictures {
        items {
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
export const deleteWhale = /* GraphQL */ `
  mutation DeleteWhale(
    $input: DeleteWhaleInput!
    $condition: ModelWhaleConditionInput
  ) {
    deleteWhale(input: $input, condition: $condition) {
      name
      pictures {
        items {
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
export const createPicture = /* GraphQL */ `
  mutation CreatePicture(
    $input: CreatePictureInput!
    $condition: ModelPictureConditionInput
  ) {
    createPicture(input: $input, condition: $condition) {
      high_res
      thumbnail
      filename
      whale {
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
export const updatePicture = /* GraphQL */ `
  mutation UpdatePicture(
    $input: UpdatePictureInput!
    $condition: ModelPictureConditionInput
  ) {
    updatePicture(input: $input, condition: $condition) {
      high_res
      thumbnail
      filename
      whale {
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
export const deletePicture = /* GraphQL */ `
  mutation DeletePicture(
    $input: DeletePictureInput!
    $condition: ModelPictureConditionInput
  ) {
    deletePicture(input: $input, condition: $condition) {
      high_res
      thumbnail
      filename
      whale {
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
export const createMatch = /* GraphQL */ `
  mutation CreateMatch(
    $input: CreateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    createMatch(input: $input, condition: $condition) {
      picture1 {
        high_res
        thumbnail
        filename
        whale {
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
        high_res
        thumbnail
        filename
        whale {
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
export const updateMatch = /* GraphQL */ `
  mutation UpdateMatch(
    $input: UpdateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    updateMatch(input: $input, condition: $condition) {
      picture1 {
        high_res
        thumbnail
        filename
        whale {
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
        high_res
        thumbnail
        filename
        whale {
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
export const deleteMatch = /* GraphQL */ `
  mutation DeleteMatch(
    $input: DeleteMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    deleteMatch(input: $input, condition: $condition) {
      picture1 {
        high_res
        thumbnail
        filename
        whale {
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
        high_res
        thumbnail
        filename
        whale {
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
export const createMatchingImage = /* GraphQL */ `
  mutation CreateMatchingImage(
    $input: CreateMatchingImageInput!
    $condition: ModelMatchingImageConditionInput
  ) {
    createMatchingImage(input: $input, condition: $condition) {
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
export const updateMatchingImage = /* GraphQL */ `
  mutation UpdateMatchingImage(
    $input: UpdateMatchingImageInput!
    $condition: ModelMatchingImageConditionInput
  ) {
    updateMatchingImage(input: $input, condition: $condition) {
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
export const deleteMatchingImage = /* GraphQL */ `
  mutation DeleteMatchingImage(
    $input: DeleteMatchingImageInput!
    $condition: ModelMatchingImageConditionInput
  ) {
    deleteMatchingImage(input: $input, condition: $condition) {
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
