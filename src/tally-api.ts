import { gql, GraphQLClient } from "graphql-request";
import { AssetType, ChainIdParams, AssetTypeParams } from "caip";
import { NomicLabsHardhatPluginError } from "hardhat/plugins";

// custom
import { pluginName, TALLY_API_URL, TALLY_DEFAULT_LOGO_URL } from "./constants";
import {
  Image,
  MutationCreateGovernanceArgs,
  MutationCreateOrganizationArgs,
  MutationCreateTokenArgs,
  Result,
  TokenInitialValues,
  MutationUploadArgs,
  RegisterProtocolMutation,
} from "./types/tally";

export async function getChains() {
  // api setup
  const tallyApiClient = new GraphQLClient(TALLY_API_URL);

  const query = gql`
    {
      chains {
        id
        name
        blockExplorerURL
      }
    }
  `;

  // fetch the supported chains from tally api
  const data = await tallyApiClient.request<Result>(query);

  return data;
}

export async function getGovernances() {
  // api setup
  const tallyApiClient = new GraphQLClient(TALLY_API_URL);

  const query = gql`
    {
      governances {
        id
        chainId
        organization {
          id
          name
        }
        contracts {
          governor {
            type
            address
          }
          tokens {
            address
          }
        }
      }
    }
  `;

  // fetch some governances from tally api
  const data = await tallyApiClient.request<Result>(query);

  return data;
}

export const registerOrganization = async (
  values: MutationCreateOrganizationArgs
): Promise<{ name: string; id: string }> => {
  const query = `
      mutation CreateOrganization(
        $name: String!,
        $description: String
        $website: String
        $icon: String
        $color: String
        $socialProfiles: SocialProfilesInput
      ) {
        createOrganization(
          name: $name
          description: $description
          website: $website
          icon: $icon
          color: $color
          socialProfiles: $socialProfiles
        ) {
          name,
          id
        }
      }`;

  const tallyApiClient = new GraphQLClient(TALLY_API_URL);

  const response = await tallyApiClient.request<{
    createOrganization: {
      name: string;
      id: string;
    };
  }>(query, values);

  const { createOrganization } = response;

  const { name, id } = createOrganization;

  return { name, id };
};

export const registerToken = async (
  values: TokenInitialValues
): Promise<boolean> => {
  const query = `
      mutation CreateToken(
        $id: AssetID!
        $start: Long!
      ) {
        createToken(
          id: $id
          start: $start
        )
      }`;

  const tallyApiClient = new GraphQLClient(TALLY_API_URL);
  const { address, chainId, start, type } = values;

  const assetId = getAssetId({
    assetName: { namespace: type, reference: address },
    chainId,
  });

  const variables: MutationCreateTokenArgs = { id: assetId, start };
  const response = await tallyApiClient.request<{
    createToken: boolean;
  }>(query, variables);

  const { createToken } = response;

  return createToken;
};

export const registerGovernance = async (
  values: MutationCreateGovernanceArgs
): Promise<boolean> => {
  const query = `
      mutation CreateGovernance(
        $address: Address!
        $chainId: ChainID!
        $organization: ID!
        $type: GovernanceType!
        $start: Long!
        $tokenId: AssetID!
      ) {
        createGovernance(
          address: $address
          chainId: $chainId
          organization: $organization
          type: $type
          start: $start
          tokenId: $tokenId
        )}`;

  const tallyApiClient = new GraphQLClient(TALLY_API_URL);

  const response = await tallyApiClient.request<{
    createGovernance: boolean;
  }>(query, values);

  const { createGovernance } = response;

  return createGovernance;
};

export const uploadFile = async (
  values: MutationUploadArgs
): Promise<{ url: string; id: string; metadata: Image }> => {
  const query = `
      mutation Upload(
        $file: Upload!, 
      ) {
        upload(
          file:{
            id: 1,
            upload: $file
          },
        ) {
          url,
          id, 
          metadata {
            thumbnail
            url
          }
        }
      }`;

  const tallyApiClient = new GraphQLClient(TALLY_API_URL);

  const response = await tallyApiClient.request<{
    upload: {
      url: string;
      id: string;
      metadata: {
        thumbnail: string;
        url: string;
      };
    };
  }>(query, values);

  const { upload } = response;

  const { url, id, metadata } = upload;

  return { url, id, metadata };
};

const getAssetNameParams = (assetName: string) => {
  const [namespace, reference] = assetName.split(":");

  return { namespace, reference };
};

export const getAssetId = ({ assetName, chainId }: AssetTypeParams): string => {
  const composeAssetId = (
    namespace: string,
    reference: string,
    chainId: string | ChainIdParams
  ) => {
    const lower = (string: string) => string.toLocaleLowerCase();

    return AssetType.format({
      assetName: { namespace: lower(namespace), reference },
      chainId,
    });
  };

  if (typeof assetName === "string") {
    const { namespace, reference } = getAssetNameParams(assetName);

    return composeAssetId(namespace, reference, chainId);
  }

  const { namespace, reference } = assetName;

  return composeAssetId(namespace, reference, chainId);
};

const getTokenId = (values: TokenInitialValues) => {
  const { chainId, type, address } = values;
  const lowerType = type.toLocaleLowerCase();

  return `${chainId}/${lowerType}:${address}`;
};

export const registerProtocol = async ({
  token,
  governance,
  organization,
}: RegisterProtocolMutation): Promise<void> => {
  let id;
  let url;

  // upload file (organization.image is a File or a json object like `{ id: 0, upload: null }`)
  try {
    const { url: logoUrl } =
      organization.image && organization.image === undefined
        ? await uploadFile({ file: { id: 0, upload: organization.image } })
        : { url: TALLY_DEFAULT_LOGO_URL };

    url = logoUrl;
  } catch (error) {
    throw new NomicLabsHardhatPluginError(
      pluginName,
      `Error uploading your logo image.`
    );
  }

  // register organization with icon url
  try {
    const { id: organizationId } = await registerOrganization({
      ...organization,
      icon: url,
    });

    id = organizationId;
  } catch (error) {
    const errorStatusMessage = (error as any)?.response?.errors[0]?.extensions
      ?.status?.message;

    throw new NomicLabsHardhatPluginError(
      pluginName,
      `Error registering organization. ${errorStatusMessage}`
    );
  }

  // register token
  try {
    await registerToken(token);
  } catch (error) {
    const errorStatusCode = (error as any)?.response?.errors[0]?.extensions
      ?.status?.code;

    const errorStatusMessage = (error as any)?.response?.errors[0]?.extensions
      ?.status?.message;

    if (errorStatusCode !== 6) {
      throw new NomicLabsHardhatPluginError(
        pluginName,
        `Error creating Token. ${errorStatusMessage}`
      );
    } else {
      throw new NomicLabsHardhatPluginError(
        pluginName,
        `${errorStatusMessage}`
      );
    }
  }

  try {
    const tokenId = getTokenId(token);

    // register governance
    const governanceWithFields = {
      ...governance,
      organization: id,
      tokenId,
    };
    await registerGovernance(governanceWithFields);
  } catch (error) {
    const errorStatusMessage = (error as any)?.response?.errors[0]?.extensions
      ?.status?.message;

    throw new NomicLabsHardhatPluginError(
      pluginName,
      `Error registering DAO. ${errorStatusMessage}`
    );
  }
};
