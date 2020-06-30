/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createWhale = /* GraphQL */ `
  mutation CreateWhale(
    $input: CreateWhaleInput!
    $condition: ModelWhaleConditionInput
  ) {
    createWhale(input: $input, condition: $condition) {
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
export const updateWhale = /* GraphQL */ `
  mutation UpdateWhale(
    $input: UpdateWhaleInput!
    $condition: ModelWhaleConditionInput
  ) {
    updateWhale(input: $input, condition: $condition) {
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
export const deleteWhale = /* GraphQL */ `
  mutation DeleteWhale(
    $input: DeleteWhaleInput!
    $condition: ModelWhaleConditionInput
  ) {
    deleteWhale(input: $input, condition: $condition) {
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
export const createConfig = /* GraphQL */ `
  mutation CreateConfig(
    $input: CreateConfigInput!
    $condition: ModelConfigConditionInput
  ) {
    createConfig(input: $input, condition: $condition) {
      id
      value
      createdAt
      updatedAt
    }
  }
`;
export const updateConfig = /* GraphQL */ `
  mutation UpdateConfig(
    $input: UpdateConfigInput!
    $condition: ModelConfigConditionInput
  ) {
    updateConfig(input: $input, condition: $condition) {
      id
      value
      createdAt
      updatedAt
    }
  }
`;
export const deleteConfig = /* GraphQL */ `
  mutation DeleteConfig(
    $input: DeleteConfigInput!
    $condition: ModelConfigConditionInput
  ) {
    deleteConfig(input: $input, condition: $condition) {
      id
      value
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
export const updatePicture = /* GraphQL */ `
  mutation UpdatePicture(
    $input: UpdatePictureInput!
    $condition: ModelPictureConditionInput
  ) {
    updatePicture(input: $input, condition: $condition) {
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
export const deletePicture = /* GraphQL */ `
  mutation DeletePicture(
    $input: DeletePictureInput!
    $condition: ModelPictureConditionInput
  ) {
    deletePicture(input: $input, condition: $condition) {
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
export const createMatch = /* GraphQL */ `
  mutation CreateMatch(
    $input: CreateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    createMatch(input: $input, condition: $condition) {
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
export const updateMatch = /* GraphQL */ `
  mutation UpdateMatch(
    $input: UpdateMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    updateMatch(input: $input, condition: $condition) {
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
export const deleteMatch = /* GraphQL */ `
  mutation DeleteMatch(
    $input: DeleteMatchInput!
    $condition: ModelMatchConditionInput
  ) {
    deleteMatch(input: $input, condition: $condition) {
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
