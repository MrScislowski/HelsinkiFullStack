import { Image } from "react-native";
import styled from "styled-components/native";
import theme from "../theme";

const TitleContainer = styled.View`
  display: flex;
  flex-direction: row;
  padding-left: 20px;
  padding-top: 20px;
`;

const TextContentContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 1;
  padding-left: 20px;
`;

const BoldTitle = styled.Text`
  padding-bottom: 5px;
  font-weight: bold;
  font-size: ${theme.fontSizes.subheading}px;
`;

const Description = styled.Text`
  color: ${theme.colors.textSecondary};
  padding-top: 5px;
  padding-bottom: 5px;
`;

const LanguageContainer = styled.View`
  background-color: ${theme.colors.primary};
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  border-radius: 5px;
`;

const Language = styled.Text`
  color: white;
`;

const FooterContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const StatContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const formatThousands = (num) => {
  if (num < 1000) {
    return `${num}`;
  }

  return `${Math.round(num / 100) / 10}k`;
};

const RepositoryItem = (props) => {
  const {
    fullName,
    description,
    language,
    stargazersCount,
    forksCount,
    reviewCount,
    ratingAverage,
    ownerAvatarUrl,
  } = props.data;

  const footerData = [
    {
      valueLabel: "Stars",
      value: stargazersCount,
    },
    {
      valueLabel: "Forks",
      value: forksCount,
    },
    {
      valueLabel: "Reviews",
      value: reviewCount,
    },
    {
      valueLabel: "Rating",
      value: ratingAverage,
    },
  ];

  return (
    <>
      <TitleContainer>
        <Image source={{ width: 50, height: 50, uri: ownerAvatarUrl }} />
        <TextContentContainer>
          <BoldTitle>{fullName}</BoldTitle>
          <Description>{description}</Description>

          <LanguageContainer>
            <Language>{language}</Language>
          </LanguageContainer>
        </TextContentContainer>
      </TitleContainer>

      <FooterContainer>
        {footerData.map(({ valueLabel, value }) => (
          <StatContainer key={valueLabel}>
            <BoldTitle>{formatThousands(value)}</BoldTitle>
            <Description>{valueLabel}</Description>
          </StatContainer>
        ))}
      </FooterContainer>
    </>
  );
};

export default RepositoryItem;
