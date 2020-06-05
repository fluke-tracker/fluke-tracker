/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateWhale = /* GraphQL */ `
  subscription OnCreateWhale($owner: String!) {
    onCreateWhale(owner: $owner) {
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
export const onUpdateWhale = /* GraphQL */ `
  subscription OnUpdateWhale($owner: String!) {
    onUpdateWhale(owner: $owner) {
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
export const onDeleteWhale = /* GraphQL */ `
  subscription OnDeleteWhale($owner: String!) {
    onDeleteWhale(owner: $owner) {
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
export const onCreatePicture = /* GraphQL */ `
  subscription OnCreatePicture($owner: String!) {
    onCreatePicture(owner: $owner) {
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
export const onUpdatePicture = /* GraphQL */ `
  subscription OnUpdatePicture($owner: String!) {
    onUpdatePicture(owner: $owner) {
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
export const onDeletePicture = /* GraphQL */ `
  subscription OnDeletePicture($owner: String!) {
    onDeletePicture(owner: $owner) {
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
export const onCreateMatch = /* GraphQL */ `
  subscription OnCreateMatch($owner: String!) {
    onCreateMatch(owner: $owner) {
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
export const onUpdateMatch = /* GraphQL */ `
  subscription OnUpdateMatch($owner: String!) {
    onUpdateMatch(owner: $owner) {
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
export const onDeleteMatch = /* GraphQL */ `
  subscription OnDeleteMatch($owner: String!) {
    onDeleteMatch(owner: $owner) {
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
export const onCreateMatchingImage = /* GraphQL */ `
  subscription OnCreateMatchingImage {
    onCreateMatchingImage {
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
export const onUpdateMatchingImage = /* GraphQL */ `
  subscription OnUpdateMatchingImage {
    onUpdateMatchingImage {
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
export const onDeleteMatchingImage = /* GraphQL */ `
  subscription OnDeleteMatchingImage {
    onDeleteMatchingImage {
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
