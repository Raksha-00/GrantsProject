/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation, GraphQLResult } from "@aws-amplify/api-graphql";
//import { Observable } from "zen-observable-ts";
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: "root"
})
export class ConfigService {
  //public baseURL: string = "https://grants-container.mamuh9kaqaore.ca-central-1.cs.amazonlightsail.com/";
  public baseURL: string = "http://localhost:8080/";
  //public baseURL: string = "http://99.79.52.238:8080/";
  //public baseURL: string = "http://10.246.64.90:8080/";
  constructor(private http: HttpClient) { }

  getGrants(temp: any)
  {
    const headers = {'content-type': 'application/json'};
    const body = JSON.stringify({'searchSentence':temp});
    return this.http.post(this.baseURL+'getgrants',body,{'headers':headers});
  }

  getInfo(temp: any)
  {
    const headers = {'content-type': 'application/json'};
    const body = JSON.stringify(temp);
    console.log(body)
    return this.http.post(this.baseURL+'piinfo',body,{'headers':headers});
  }

}
/*
export interface SubscriptionResponse<T> {
  value: GraphQLResult<T>;
}

export type __SubscriptionContainer = {
  onCreateRank: OnCreateRankSubscription;
  onUpdateRank: OnUpdateRankSubscription;
  onDeleteRank: OnDeleteRankSubscription;
};

export type CreateRankInput = {
  id?: string | null;
  name: string;
  description: string;
};

export type ModelRankConditionInput = {
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  and?: Array<ModelRankConditionInput | null> | null;
  or?: Array<ModelRankConditionInput | null> | null;
  not?: ModelRankConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null"
}

export type ModelSizeInput = {
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type Rank = {
  __typename: "Rank";
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateRankInput = {
  id: string;
  name?: string | null;
  description?: string | null;
};

export type DeleteRankInput = {
  id: string;
};

export type ModelRankFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  and?: Array<ModelRankFilterInput | null> | null;
  or?: Array<ModelRankFilterInput | null> | null;
  not?: ModelRankFilterInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelRankConnection = {
  __typename: "ModelRankConnection";
  items: Array<Rank | null>;
  nextToken?: string | null;
};

export type CreateRankMutation = {
  __typename: "Rank";
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateRankMutation = {
  __typename: "Rank";
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type DeleteRankMutation = {
  __typename: "Rank";
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type GetRankQuery = {
  __typename: "Rank";
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ListRanksQuery = {
  __typename: "ModelRankConnection";
  items: Array<{
    __typename: "Rank";
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  } | null>;
  nextToken?: string | null;
};

export type OnCreateRankSubscription = {
  __typename: "Rank";
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type OnUpdateRankSubscription = {
  __typename: "Rank";
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type OnDeleteRankSubscription = {
  __typename: "Rank";
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

@Injectable({
  providedIn: "root"
})
export class APIService {


  async CreateRank(
    input: CreateRankInput,
    condition?: ModelRankConditionInput
  ): Promise<CreateRankMutation> {
    const statement = `mutation CreateRank($input: CreateRankInput!, $condition: ModelRankConditionInput) {
        createRank(input: $input, condition: $condition) {
          __typename
          id
          name
          description
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateRankMutation>response.data.createRank;
  }
  async UpdateRank(
    input: UpdateRankInput,
    condition?: ModelRankConditionInput
  ): Promise<UpdateRankMutation> {
    const statement = `mutation UpdateRank($input: UpdateRankInput!, $condition: ModelRankConditionInput) {
        updateRank(input: $input, condition: $condition) {
          __typename
          id
          name
          description
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateRankMutation>response.data.updateRank;
  }
  async DeleteRank(
    input: DeleteRankInput,
    condition?: ModelRankConditionInput
  ): Promise<DeleteRankMutation> {
    const statement = `mutation DeleteRank($input: DeleteRankInput!, $condition: ModelRankConditionInput) {
        deleteRank(input: $input, condition: $condition) {
          __typename
          id
          name
          description
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    if (condition) {
      gqlAPIServiceArguments.condition = condition;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteRankMutation>response.data.deleteRank;
  }
  async GetRank(id: string): Promise<GetRankQuery> {
    const statement = `query GetRank($id: ID!) {
        getRank(id: $id) {
          __typename
          id
          name
          description
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetRankQuery>response.data.getRank;
  }
  async ListRanks(
    filter?: ModelRankFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListRanksQuery> {
    const statement = `query ListRanks($filter: ModelRankFilterInput, $limit: Int, $nextToken: String) {
        listRanks(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            name
            description
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListRanksQuery>response.data.listRanks;
  }
  OnCreateRankListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateRank">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateRank {
        onCreateRank {
          __typename
          id
          name
          description
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onCreateRank">>
  >;

  OnUpdateRankListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateRank">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateRank {
        onUpdateRank {
          __typename
          id
          name
          description
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onUpdateRank">>
  >;

  OnDeleteRankListener: Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteRank">>
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteRank {
        onDeleteRank {
          __typename
          id
          name
          description
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<
    SubscriptionResponse<Pick<__SubscriptionContainer, "onDeleteRank">>
  >;
}*/
