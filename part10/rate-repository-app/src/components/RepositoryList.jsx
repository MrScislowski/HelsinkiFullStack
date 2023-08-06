import { useState, useEffect } from "react";
import { FlatList, Text } from "react-native";
import RepositoryItem from "./RepositoryItem";
import useRepositories from "../hooks/useRepositories";
import styled from "styled-components/native";

const ItemSeparator = styled.View`
  height: 10px;
  backgroundcolor: lightgrey;
`;

const RepositoryList = () => {
  const { repositories, loading } = useRepositories();

  if (loading) {
    return <Text>loading</Text>;
  }

  const repositoryNodes = repositories
    ? repositories.repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item, index, separators }) => (
        <RepositoryItem data={item} />
      )}
    />
  );
};

export default RepositoryList;
