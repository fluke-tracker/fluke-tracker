/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createWhale = /* GraphQL */ `
  mutation CreateWhale(
    $input: CreateWhaleInput!
    $condition: ModelWhaleConditionInput
  ) {
    createWhale(input: $input, condition: $condition) {
      name
      createdAt
      updatedAt
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
      createdAt
      updatedAt
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
      createdAt
      updatedAt
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
export const createMatches = /* GraphQL */ `
  mutation CreateMatches(
    $input: CreateMatchesInput!
    $condition: ModelMatchesConditionInput
  ) {
    createMatches(input: $input, condition: $condition) {
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
export const updateMatches = /* GraphQL */ `
  mutation UpdateMatches(
    $input: UpdateMatchesInput!
    $condition: ModelMatchesConditionInput
  ) {
    updateMatches(input: $input, condition: $condition) {
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
export const deleteMatches = /* GraphQL */ `
  mutation DeleteMatches(
    $input: DeleteMatchesInput!
    $condition: ModelMatchesConditionInput
  ) {
    deleteMatches(input: $input, condition: $condition) {
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
