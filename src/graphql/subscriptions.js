/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateWhale = /* GraphQL */ `
  subscription OnCreateWhale {
    onCreateWhale {
      name
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateWhale = /* GraphQL */ `
  subscription OnUpdateWhale {
    onUpdateWhale {
      name
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteWhale = /* GraphQL */ `
  subscription OnDeleteWhale {
    onDeleteWhale {
      name
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePicture = /* GraphQL */ `
  subscription OnCreatePicture {
    onCreatePicture {
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
export const onUpdatePicture = /* GraphQL */ `
  subscription OnUpdatePicture {
    onUpdatePicture {
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
export const onDeletePicture = /* GraphQL */ `
  subscription OnDeletePicture {
    onDeletePicture {
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
export const onCreateMatches = /* GraphQL */ `
  subscription OnCreateMatches {
    onCreateMatches {
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
export const onUpdateMatches = /* GraphQL */ `
  subscription OnUpdateMatches {
    onUpdateMatches {
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
export const onDeleteMatches = /* GraphQL */ `
  subscription OnDeleteMatches {
    onDeleteMatches {
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
