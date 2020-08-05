import gql from "graphql-tag";

export const CREATE_DASHBOARD_ITEM = gql`
  mutation CreateDashboardItem($input: CreateDashboardItemInput!) {
    createDashboardItem(input: $input) {
      id
      layout
      vizState
      name
    }
  }
`;

export const UPDATE_DASHBOARD_ITEM = gql`
  mutation UpdateDashboardItem($input: UpdateDashboardItemInput!) {
    updateDashboardItem(input: $input) {
      id
      layout
      vizState
      name
    }
  }
`;

export const DELETE_DASHBOARD_ITEM = gql`
  mutation DeleteDashboardItem($id: ID!) {
    deleteDashboardItem(input: { id: $id }) {
      id
      layout
      vizState
      name
    }
  }
`;