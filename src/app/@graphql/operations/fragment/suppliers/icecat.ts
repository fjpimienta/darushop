import gql from 'graphql-tag';

export const ICECATPRODUCT_FRAGMENT = gql`
  fragment icecatProductObject on IcecatProduct {
    GeneralInfo {
      IcecatId
      ReleaseDate
      EndOfLifeDate
      Title
      TitleInfo {
          GeneratedIntTitle
          GeneratedLocalTitle {
              Value
              Language
          }
          BrandLocalTitle {
              Value
              Language
          }
      }
      Brand
      BrandID
      BrandLogo
      BrandInfo {
          BrandName
          BrandLocalName
          BrandLogo
      }
      ProductName
      ProductNameInfo {
          ProductIntName
          ProductLocalName {
              Value
              Language
          }
      }
      BrandPartCode
      GTIN
      Category {
          CategoryID
          Name {
              Value
              Language
          }
      }
      ProductFamily {
          empty
      }
      ProductSeries {
          SeriesID
      }
      Description {
          empty
      }
      SummaryDescription {
          ShortSummaryDescription
          LongSummaryDescription
      }
      BulletPoints {
          empty
      }
      GeneratedBulletPoints {
          Language
          Values
      }
    }
    Image {
      HighPic
      HighPicSize
      HighPicHeight
      HighPicWidth
      LowPic
      LowPicSize
      LowPicHeight
      LowPicWidth
      Pic500x500
      Pic500x500Size
      Pic500x500Height
      Pic500x500Width
      ThumbPic
      ThumbPicSize
    }
    Multimedia {
      ID
      URL
      Type
      ContentType
      KeepAsUrl
      Description
      Size
      IsPrivate
      Updated
      Language
      IsVideo
      ThumbUrl
      PreviewUrl
    }
    Gallery {
      ID
      LowPic
      LowSize
      LowHeight
      LowWidth
      ThumbPic
      ThumbPicSize
      Pic
      Size
      PicHeight
      PicWidth
      Pic500x500
      Pic500x500Size
      Pic500x500Height
      Pic500x500Width
      No
      IsMain
      Updated
      IsPrivate
      Type
      Attributes {
          OriginalFileName
      }
    }
  }
`;
