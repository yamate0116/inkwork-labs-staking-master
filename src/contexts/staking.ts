export type Staking = {
  version: "0.1.0";
  name: "staking";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "admin";
          isMut: true;
          isSigner: true;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        }
      ];
    },
    {
      name: "initializeUserPool";
      accounts: [
        {
          name: "userPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [];
    },
    {
      name: "stakeNftToPool";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userNftTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destNftTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintMetadata";
          isMut: true;
          isSigner: false;
          docs: ["the mint metadata"];
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        }
      ];
    },
    {
      name: "claimReward";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userRewardAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        }
      ];
    },
    {
      name: "withdrawNftFromPool";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userPool";
          isMut: true;
          isSigner: false;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userNftTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "destNftTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userRewardAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "nftMint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "globalBump";
          type: "u8";
        }
      ];
    },
    {
      name: "withdrawToken";
      accounts: [
        {
          name: "owner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "globalAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "rewardVault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "userRewardAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "bump";
          type: "u8";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "globalPool";
      type: {
        kind: "struct";
        fields: [
          {
            name: "superAdmin";
            type: "publicKey";
          },
          {
            name: "totalStakedCount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "userPool";
      type: {
        kind: "struct";
        fields: [
          {
            name: "owner";
            type: "publicKey";
          },
          {
            name: "stakedCount";
            type: "u64";
          },
          {
            name: "staking";
            type: {
              array: [
                {
                  defined: "StakedData";
                },
                100
              ];
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "StakedData";
      docs: ["User PDA Layout"];
      type: {
        kind: "struct";
        fields: [
          {
            name: "mint";
            type: "publicKey";
          },
          {
            name: "stakedTime";
            type: "i64";
          }
        ];
      };
    }
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidSuperOwner";
      msg: "Invalid Super Owner";
    },
    {
      code: 6001;
      name: "InvalidGlobalPool";
      msg: "Invalid Global Pool Address";
    },
    {
      code: 6002;
      name: "InvalidUserPool";
      msg: "Invalid User Pool Owner Address";
    },
    {
      code: 6003;
      name: "InvalidWithdrawTime";
      msg: "Invalid Withdraw Time";
    },
    {
      code: 6004;
      name: "InvalidNFTAddress";
      msg: "Not Found Staked Mint";
    },
    {
      code: 6005;
      name: "InsufficientRewardVault";
      msg: "Insufficient Reward Token Balance";
    },
    {
      code: 6006;
      name: "InsufficientAccountVault";
      msg: "Insufficient Account Token Balance";
    },
    {
      code: 6007;
      name: "InvalidMetadata";
      msg: "Invalid Metadata Address";
    },
    {
      code: 6008;
      name: "MetadataCreatorParseError";
      msg: "Can't Parse The NFT's Creators";
    },
    {
      code: 6009;
      name: "UnkownOrNotAllowedNFTCollection";
      msg: "Unknown Collection Or The Collection Is Not Allowed";
    }
  ];
};

export const IDL: Staking = {
  version: "0.1.0",
  name: "staking",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "admin",
          isMut: true,
          isSigner: true,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
      ],
    },
    {
      name: "initializeUserPool",
      accounts: [
        {
          name: "userPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "stakeNftToPool",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userNftTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destNftTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nftMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintMetadata",
          isMut: true,
          isSigner: false,
          docs: ["the mint metadata"],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
      ],
    },
    {
      name: "claimReward",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nftMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
      ],
    },
    {
      name: "withdrawNftFromPool",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userPool",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userNftTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destNftTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "nftMint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "globalBump",
          type: "u8",
        },
      ],
    },
    {
      name: "withdrawToken",
      accounts: [
        {
          name: "owner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "globalAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "rewardVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "bump",
          type: "u8",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "globalPool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "superAdmin",
            type: "publicKey",
          },
          {
            name: "totalStakedCount",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "userPool",
      type: {
        kind: "struct",
        fields: [
          {
            name: "owner",
            type: "publicKey",
          },
          {
            name: "stakedCount",
            type: "u64",
          },
          {
            name: "staking",
            type: {
              array: [
                {
                  defined: "StakedData",
                },
                100,
              ],
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "StakedData",
      docs: ["User PDA Layout"],
      type: {
        kind: "struct",
        fields: [
          {
            name: "mint",
            type: "publicKey",
          },
          {
            name: "stakedTime",
            type: "i64",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidSuperOwner",
      msg: "Invalid Super Owner",
    },
    {
      code: 6001,
      name: "InvalidGlobalPool",
      msg: "Invalid Global Pool Address",
    },
    {
      code: 6002,
      name: "InvalidUserPool",
      msg: "Invalid User Pool Owner Address",
    },
    {
      code: 6003,
      name: "InvalidWithdrawTime",
      msg: "Invalid Withdraw Time",
    },
    {
      code: 6004,
      name: "InvalidNFTAddress",
      msg: "Not Found Staked Mint",
    },
    {
      code: 6005,
      name: "InsufficientRewardVault",
      msg: "Insufficient Reward Token Balance",
    },
    {
      code: 6006,
      name: "InsufficientAccountVault",
      msg: "Insufficient Account Token Balance",
    },
    {
      code: 6007,
      name: "InvalidMetadata",
      msg: "Invalid Metadata Address",
    },
    {
      code: 6008,
      name: "MetadataCreatorParseError",
      msg: "Can't Parse The NFT's Creators",
    },
    {
      code: 6009,
      name: "UnkownOrNotAllowedNFTCollection",
      msg: "Unknown Collection Or The Collection Is Not Allowed",
    },
  ],
};
