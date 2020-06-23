/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateWhale = /* GraphQL */ `
  subscription OnCreateWhale {
    onCreateWhale {
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
export const onUpdateWhale = /* GraphQL */ `
  subscription OnUpdateWhale {
    onUpdateWhale {
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
export const onDeleteWhale = /* GraphQL */ `
  subscription OnDeleteWhale {
    onDeleteWhale {
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
export const onCreatePicture = /* GraphQL */ `
  subscription OnCreatePicture {
    onCreatePicture {
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
export const onUpdatePicture = /* GraphQL */ `
  subscription OnUpdatePicture {
    onUpdatePicture {
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
export const onDeletePicture = /* GraphQL */ `
  subscription OnDeletePicture {
    onDeletePicture {
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
export const onCreateMatch = /* GraphQL */ `
  subscription OnCreateMatch {
    onCreateMatch {
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
export const onUpdateMatch = /* GraphQL */ `
  subscription OnUpdateMatch {
    onUpdateMatch {
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
export const onDeleteMatch = /* GraphQL */ `
  subscription OnDeleteMatch {
    onDeleteMatch {
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
    }
  }
`;
