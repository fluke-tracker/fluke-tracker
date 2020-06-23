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
        }
        nextToken
      }
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
        }
        nextToken
      }
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
        }
        nextToken
      }
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
        }
        match_status
        similarity_score
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
        }
        match_status
        similarity_score
      }
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
        }
        match_status
        similarity_score
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
        }
        match_status
        similarity_score
      }
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
        }
        match_status
        similarity_score
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
        }
        match_status
        similarity_score
      }
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
        }
        geocoords
        date_taken
        embedding
        uploaded_by
        matchLeft {
          match_status
          similarity_score
        }
        matchRight {
          match_status
          similarity_score
        }
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
        }
        geocoords
        date_taken
        embedding
        uploaded_by
        matchLeft {
          match_status
          similarity_score
        }
        matchRight {
          match_status
          similarity_score
        }
      }
      match_status
      similarity_score
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
        }
        geocoords
        date_taken
        embedding
        uploaded_by
        matchLeft {
          match_status
          similarity_score
        }
        matchRight {
          match_status
          similarity_score
        }
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
        }
        geocoords
        date_taken
        embedding
        uploaded_by
        matchLeft {
          match_status
          similarity_score
        }
        matchRight {
          match_status
          similarity_score
        }
      }
      match_status
      similarity_score
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
        }
        geocoords
        date_taken
        embedding
        uploaded_by
        matchLeft {
          match_status
          similarity_score
        }
        matchRight {
          match_status
          similarity_score
        }
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
        }
        geocoords
        date_taken
        embedding
        uploaded_by
        matchLeft {
          match_status
          similarity_score
        }
        matchRight {
          match_status
          similarity_score
        }
      }
      match_status
      similarity_score
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
    }
  }
`;
