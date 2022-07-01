export type Organization = {
  id: string;
  name: string;
};

export type Contract = {
  governor: {
    type: string;
    address: string;
  };
  tokens: {
    address: string;
  }[];
};

export type Governance = {
  id: string;
  chainId: string;
  contracts: Contract;
  organization: Organization;
};

export type Result = {
  governances: Governance[];
};

export type MutationUploadArgs = {
  file: {
    id: number;
    upload: any;
  };
};

export type Image = {
  thumbnail?: string;
  url?: string;
};

export interface AssetNameParams {
  namespace: string;
  reference: string;
}

export type TokenInitialValues = {
  type: "ERC20" | "ERC721";
  start: string;
  address: string;
  chainId: string;
};

export type MutationCreateTokenArgs = {
  id: string;
  start: string;
};
export interface ParameterSpec {
  name: string;
  regex: string;
}

export interface IdentifierSpec extends ParameterSpec {
  parameters: {
    delimiter: string;
    values: {
      [index: string]: ParameterSpec;
    };
  };
}

export declare class AssetName {
  static spec: IdentifierSpec;
  static parse(id: string): AssetNameParams;
  static format(params: AssetNameParams): string;
  namespace: string;
  reference: string;
  constructor(params: AssetNameParams | string);
  toString(): string;
  toJson(): AssetNameParams;
}

export type ContactInformation = {
  email: string;
  name: string;
};

export type SocialProfilesInput = {
  Discord?: string;
  Others?: string[];
  Telegram?: string;
  Twitter?: string;
};

export type MutationCreateOrganizationArgs = {
  color?: string;
  contact?: ContactInformation;
  description?: string;
  icon?: string;
  name: string;
  socialProfiles?: SocialProfilesInput;
  website?: string;
};

export type MutationCreateGovernanceArgs = {
  address: string;
  chainId: string;
  name?: string;
  organization: string;
  start: string;
  tokenId: string;
  type: "GOVERNORALPHA" | "GOVERNORBRAVO" | "OPENZEPPELINGOVERNOR";
};

export type RegisterProtocolsParams = {
  values: RegisterProtocolMutation;
};

export type ORegisterGovernance = Pick<Organization, "id" | "name">;

export type GovernanceInitialValues = Omit<
  MutationCreateGovernanceArgs,
  "tokenId" | "organization"
>;

export type RegisterProtocolMutation = {
  token: TokenInitialValues;
  governance: GovernanceInitialValues;
  organization: MutationCreateOrganizationArgs & {
    image?: any;
    ens?: string;
  };
};

export interface TallyPublishDao {
  (dao: DaoToPublish): Promise<string>;
}

export type GovernanceContract = {
  address: string;
  type: "GOVERNORALPHA" | "GOVERNORBRAVO" | "OPENZEPPELINGOVERNOR";
};

export type TokenContract = {
  address: string;
  type: "ERC20" | "ERC721";
};

export interface DaoToPublish {
  name: string;
  description?: string;
  website?: string;
  color?: string;
  contracts: {
    governor: GovernanceContract;
    token: TokenContract;
  };
}
